const ABOUT_SETTINGS_UUID = '{73e40ef0-7f3c-11e6-bdf4-0800200c9a66}';
const ABOUT_SETTINGS_PAGE = 'newtaboverride';
const ABOUT_SETTINGS_URI = 'about:' + ABOUT_SETTINGS_PAGE;

const ABOUT_FEED_UUID = '{67eb5aa0-8b2f-11e6-bdf4-0800200c9a66}';
const ABOUT_FEED_PAGE = 'newtabfeed';
const ABOUT_FEED_URI = 'about:' + ABOUT_FEED_PAGE;

const CLIPBOARD_INTERVAL_IN_MILLISECONDS = 500;
const FEED_URL = 'https://www.soeren-hentzschel.at/feed/';
const URL_CHARS_LIMIT = 2000;

const _ = require('sdk/l10n').get;
const { ActionButton } = require('sdk/ui/button/action');
const { PrefsTarget } = require('sdk/preferences/event-target');
const { setInterval, clearInterval } = require('sdk/timers');
const { viewFor } = require('sdk/view/core');
const aboutpage = require('lib/aboutpage.js');
const clipboard = require('sdk/clipboard');
const feedreader = require('lib/feedreader.js');
const newTabUrlJsm = require('resource:///modules/NewTabURL.jsm').NewTabURL;
const pageMod = require('sdk/page-mod');
const preferencesService = require('sdk/preferences/service');
const prefsTarget = PrefsTarget({ branchName: 'browser.startup.'});
const self = require('sdk/self');
const simplePrefs = require('sdk/simple-prefs');
const tabs = require('sdk/tabs');
const tabutils = require('sdk/tabs/utils');
const windows = require('sdk/windows');

const SettingsPage = aboutpage.createAboutPage('settings');
const SettingsPageFactory = aboutpage.createAboutPageFactory(SettingsPage);

const FeedPage = aboutpage.createAboutPage('feed');
const FeedPageFactory = aboutpage.createAboutPageFactory(FeedPage);

const newtaboverride = {
  actionButton : null,
  lastClipboardUrl : false,
  timer : false,

  init : function () {
    newtaboverride.initPageMods();
    newtaboverride.onPrefChange();
    newtaboverride.createButton();
  },

  initPageMods : function () {
    pageMod.PageMod({
      include: [ABOUT_SETTINGS_URI],
      contentScriptFile: [self.data.url('js/common.js'), self.data.url('js/settings.js')],
      contentStyleFile: [self.data.url('css/common.css'), self.data.url('css/settings.css')],
      onAttach: function (worker) {
        const langvars = [
          'clear_locationbar_caption',
          'clear_locationbar_label',
          'focus_website_caption',
          'focus_website_label',
          'nto_introduction_part1',
          'nto_introduction_part2',
          'review_text',
          'settings_ask_questions',
          'settings_code_caption',
          'settings_code_link',
          'settings_donate',
          'settings_donation_text',
          'settings_licence_link',
          'settings_main_caption',
          'settings_support_caption',
          'settings_title',
          'settings_url_field.placeholder',
          'type_options.about_newtab',
          'type_options.clipboard',
          'type_options.custom_url',
          'type_options.feed',
          'type_options.homepage',
          'type_title',
          'url_description',
          'url_title'
        ];

        worker.port.emit('data-url', self.data.url());
        worker.port.emit('i18n', newtaboverride.getTranslationsForPageMod(langvars));
        worker.port.emit('show-preferences', simplePrefs);

        worker.port.on('change-preference', (preference) => {
          simplePrefs.prefs[preference.key] = preference.value;
        });
      }
    });

    pageMod.PageMod({
      include: [ABOUT_FEED_URI],
      contentScriptFile: [self.data.url('js/common.js'), self.data.url('js/feed.js')],
      contentStyleFile: [self.data.url('css/common.css'), self.data.url('css/feed.css')],
      onAttach: function (worker) {
        const langvars = [
          'feed_published_at.global',
          'feed_read_more.global',
          'feed_title',
          'review_text',
          'settings_ask_questions',
          'settings_code_caption',
          'settings_code_link',
          'settings_donate',
          'settings_donation_text',
          'settings_licence_link',
          'settings_support_caption'
        ];

        worker.port.emit('data-url', self.data.url());
        worker.port.emit('i18n', newtaboverride.getTranslationsForPageMod(langvars));

        feedreader.getFeedItems(FEED_URL).then(function (result) {
          worker.port.emit('feed-items', result);
        });
      }
    });
  },

  getTranslationsForPageMod : function (langvars) {
    const t = { };

    for (let langvar of langvars) {
      t[langvar] = _(langvar);
    }

    return t;
  },

  onPrefChange : function () {
    const type = simplePrefs.prefs['type'];
    let newTabUrl;

    switch (type) {
      case 'about:blank':
      case 'about:home':
      case 'about:newtab':
      case 'about:sync-tabs':
        newTabUrl = type;
        break;
      case 'clipboard':
        newTabUrl = 'about:blank';
        // unfortunately there is no "clipboard changed" event…
        newtaboverride.timer = setInterval(newtaboverride.clipboardAction, CLIPBOARD_INTERVAL_IN_MILLISECONDS);
        break;
      case 'custom_url':
        const url = simplePrefs.prefs['url'];
        if (url === '') {
          newTabUrl = 'about:blank';
        } else {
          newTabUrl = url;
        }
        break;
      case 'homepage':
        newTabUrl = preferencesService.getLocalized('browser.startup.homepage', 'about:blank').split('|')[0];
        break;
      case 'feed':
        newTabUrl = ABOUT_FEED_URI;
        break;
      default:
        newTabUrl = 'about:newtab';
    }

    if (type !== 'clipboard') {
      clearInterval(newtaboverride.timer);
      newtaboverride.lastClipboardUrl = false;
    }

    newTabUrlJsm.override(newTabUrl);

    const focus_website = simplePrefs.prefs['focus_website'];
    if (focus_website) {
      tabs.on('open', newtaboverride.focusListener);
    } else {
      tabs.removeListener('open', newtaboverride.focusListener);
    }

    const clear_locationbar = simplePrefs.prefs['clear_locationbar'];
    if (clear_locationbar) {
      tabs.on('open', newtaboverride.clearLocationBarListener);
    } else {
      tabs.removeListener('open', newtaboverride.clearLocationBarListener);
    }
  },

  focusListener: function (tab) {
    let tab_opened = true;
    tab.on('ready', function () {
      if (tab_opened) {
        let xultab = viewFor(tab);
        let browser = tabutils.getBrowserForTab(xultab);
        browser.focus();
        tab_opened = false;
      }
    });
  },

  clearLocationBarListener: function (tab) {
    let tab_opened = true;
    tab.on('ready', function () {
      if (tab_opened) {
        let xultab = viewFor(tab);
        let window = tabutils.getOwnerWindow(xultab);
        window.document.getElementById('urlbar').value = '';
        tab_opened = false;
      }
    });
  },

  createButton : function () {
    newtaboverride.actionButton = ActionButton({
      id : 'newtaboverride-button',
      label : _('settings_title_short'),
      icon : {
        '18' : self.data.url('images/icon-18.png'),
        '32' : self.data.url('images/icon-32.png'),
        '36' : self.data.url('images/icon-36.png'),
        '64' : self.data.url('images/icon-64.png')
      },
      onClick : () => {
        if (newtaboverride.actionButton.badge) {
          newtaboverride.actionButton.badge = null;
        }

        for (let window of windows.browserWindows) {
          for (let tab of window.tabs) {
            if (tab.url === ABOUT_SETTINGS_URI) {
              window.activate();
              tab.activate();
              return;
            }
          }
        }

        tabs.open({
          url : ABOUT_SETTINGS_URI
        });
      }
    });
  },

  clipboardAction : function () {
    const clipboardContent = clipboard.get();

    if (clipboard.currentFlavors.indexOf('text') === -1) {
      return;
    }

    if (clipboardContent.length > URL_CHARS_LIMIT || !newtaboverride.isValidUri(clipboardContent)) {
      return;
    }

    if (!newtaboverride.lastClipboardUrl || clipboardContent !== newtaboverride.lastClipboardUrl) {
      newTabUrlJsm.override(clipboardContent);
      newtaboverride.lastClipboardUrl = clipboardContent;
    }
  },

  /**
   * @see http://stackoverflow.com/a/9284473
   */
  isValidUri : function (string) {
    const website = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    const aboutpage = /^about:(about|accounts|addons|blank|buildconfig|cache|checkerboard|config|crashes|credits|debugging|downloads|healthreport|home|license|logo|memory|mozilla|networking|newtab|performance|plugins|preferences|privatebrowsing|profiles|rights|robots|searchreset|serviceworkers|support|sync-log|sync-tabs|telemetry|webrtc)?$/i;

    return website.test(string) || aboutpage.test(string) || string === ABOUT_SETTINGS_URI || string === ABOUT_FEED_URI;
  }
};

const main = (options) => {
  aboutpage.registerAboutPage(ABOUT_SETTINGS_UUID, ABOUT_SETTINGS_URI, ABOUT_SETTINGS_PAGE, SettingsPageFactory);
  aboutpage.registerAboutPage(ABOUT_FEED_UUID, ABOUT_FEED_URI, ABOUT_FEED_PAGE, FeedPageFactory);

  newtaboverride.init();

  simplePrefs.on('', newtaboverride.onPrefChange);
  prefsTarget.on('homepage', newtaboverride.onPrefChange);

  if (options.loadReason === 'install') {
    newtaboverride.actionButton.badge = '★';
  }
};

const unload = (reason) => {
  if (reason === 'uninstall' || reason === 'disable') {
    clearInterval(newtaboverride.timer);
    newtaboverride.lastClipboardUrl = false;
    newTabUrlJsm.reset();
  }

  aboutpage.unregisterAboutPage(ABOUT_SETTINGS_UUID, SettingsPageFactory);
  aboutpage.unregisterAboutPage(ABOUT_FEED_UUID, FeedPageFactory);
};

exports.main = main;
exports.onUnload = unload;
