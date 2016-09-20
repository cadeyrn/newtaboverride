const ABOUT_UUID = '{73e40ef0-7f3c-11e6-bdf4-0800200c9a66}';
const ABOUT_PAGE = 'newtaboverride';
const ABOUT_URI = 'about:' + ABOUT_PAGE;
const ONE_SECOND_IN_MILLISECONDS = 1000;
const URL_CHARS_LIMIT = 2000;

const _ = require('sdk/l10n').get;
const { ActionButton } = require('sdk/ui/button/action');
const { Ci, Cm, Cr, components } = require('chrome');
const { PrefsTarget } = require('sdk/preferences/event-target');
const { setInterval, clearInterval } = require('sdk/timers');
const clipboard = require('sdk/clipboard');
const newTabUrlJsm = require('resource:///modules/NewTabURL.jsm').NewTabURL;
const preferencesService = require('sdk/preferences/service');
const prefsTarget = PrefsTarget({ branchName: 'browser.startup.'});
const self = require('sdk/self');
const services = require('resource://gre/modules/Services.jsm').Services;
const simplePrefs = require('sdk/simple-prefs');
const tabs = require('sdk/tabs');
const XPCOMUtils = require('resource://gre/modules/XPCOMUtils.jsm').XPCOMUtils;
const windows = require('sdk/windows');

const AboutPageFactory = {
  createInstance: function(outer, iid) {
    if (outer) {
      throw Cr.NS_ERROR_NO_AGGREGATION;
    }

    return AboutPage.QueryInterface(iid);
  }
};

const AboutPage = {
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

  getURIFlags: function(aURI) {
    return Ci.nsIAboutModule.ALLOW_SCRIPT;
  },

  newChannel: function(aURI, aSecurity_or_aLoadInfo) {
    let channel;

    // Firefox >= 48
    if (services.vc.compare(services.appinfo.version, '47.*') > 0) {
      let uri = services.io.newURI(self.data.url('html/settings.html'), null, null);
      channel = services.io.newChannelFromURIWithLoadInfo(uri, aSecurity_or_aLoadInfo);
    }
    // Firefox <= 47
    else {
      channel = services.io.newChannel(self.data.url('html/settings.html'), null, null);
    }

    channel.originalURI = aURI;
    return channel;
  }
};

const newtaboverride = {
  actionButton : null,
  lastClipboardUrl : false,
  timer : false,

  init : function () {
    newtaboverride.initPageMod();
    newtaboverride.onPrefChange();
    newtaboverride.createButton();
  },

  initPageMod : function () {
    const pageMod = require('sdk/page-mod');
    pageMod.PageMod({
      include: [ABOUT_URI],
      contentScriptFile: [self.data.url('js/content-script.js')],
      contentStyleFile: [self.data.url('css/settings.css')],
      onAttach: function(worker) {
        let t = {};
        let langvars = [
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
          'type_options.homepage',
          'type_title',
          'url_description',
          'url_title'
        ];

        for (let langvar of langvars) {
          t[langvar] = _(langvar);
        }

        worker.port.emit('data-url', self.data.url());
        worker.port.emit('i18n', t);
        worker.port.emit('show-preferences', simplePrefs);

        worker.port.on('change-preference', (preference) => {
          simplePrefs.prefs[preference.key] = preference.value;
        });
      }
    });
  },

  onPrefChange : function () {
    var type = simplePrefs.prefs['type'];
    var newTabUrl;

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
        newtaboverride.timer = setInterval(newtaboverride.clipboardAction, ONE_SECOND_IN_MILLISECONDS / 2);
        break;
      case 'custom_url':
        var url = simplePrefs.prefs['url'];
        if (url === '') {
          newTabUrl = 'about:blank';
        } else {
          newTabUrl = url;
        }
        break;
      case 'homepage':
        newTabUrl = preferencesService.getLocalized('browser.startup.homepage', 'about:blank').split('|')[0];
        break;
      default:
        newTabUrl = 'about:newtab';
    }

    if (type !== 'clipboard') {
      clearInterval(newtaboverride.timer);
      newtaboverride.lastClipboardUrl = false;
    }

    newTabUrlJsm.override(newTabUrl);
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
            if (tab.url === ABOUT_URI) {
              window.activate();
              tab.activate();
              return;
            }
          }
        }

        tabs.open({
          url : ABOUT_URI
        });
      }
    });
  },

  clipboardAction : function () {
    var clipboardContent = clipboard.get();

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
    var website = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    var aboutpage = /^about:(about|accounts|addons|blank|buildconfig|cache|checkerboard|config|crashes|credits|debugging|downloads|healthreport|home|license|logo|memory|mozilla|networking|newtab|performance|plugins|preferences|privatebrowsing|profiles|rights|robots|searchreset|serviceworkers|support|sync-log|sync-tabs|telemetry|webrtc)?$/i;

    return website.test(string) || aboutpage.test(string) || string === ABOUT_URI;
  }
};

const main = (options) => {
  Cm.QueryInterface(Ci.nsIComponentRegistrar).registerFactory(
      components.ID(ABOUT_UUID),
      ABOUT_URI,
      '@mozilla.org/network/protocol/about;1?what=' + ABOUT_PAGE,
      AboutPageFactory
  );

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

  Cm.QueryInterface(Ci.nsIComponentRegistrar).unregisterFactory(
      components.ID(ABOUT_UUID), AboutPageFactory
  );
};

exports.main = main;
exports.onUnload = unload;
