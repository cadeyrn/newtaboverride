const CLIPBOARD_INTERVAL_IN_MILLISECONDS = 500;
const URL_CHARS_LIMIT = 2000;

const { PrefsTarget } = require('sdk/preferences/event-target');
const { setInterval, clearInterval } = require('sdk/timers');
const { viewFor } = require('sdk/view/core');
const clipboard = require('sdk/clipboard');
const newTabUrlJsm = require('resource:///modules/NewTabURL.jsm').NewTabURL;
const preferencesService = require('sdk/preferences/service');
const prefsTarget = PrefsTarget({ branchName: 'browser.startup.'});
const simplePrefs = require('sdk/simple-prefs');
const tabs = require('sdk/tabs');
const tabutils = require('sdk/tabs/utils');
const windows = require('sdk/windows');

const newtaboverride = {
  lastClipboardUrl : false,
  timer : false,

  init : function () {
    newtaboverride.onPrefChange();
  },

  onPrefChange : function () {
    const type = simplePrefs.prefs['type'];
    let newTabUrl;

    switch (type) {
      case 'about:newtab':
        newTabUrl = type;
        break;
      case 'clipboard':
        newTabUrl = 'about:blank';
        // unfortunately there is no "clipboard changed" event…
        newtaboverride.timer = setInterval(newtaboverride.clipboardAction, CLIPBOARD_INTERVAL_IN_MILLISECONDS);
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
    const aboutpage = /^about:(about|accounts|addons|blank|buildconfig|cache|checkerboard|config|crashes|credits|debugging|downloads|healthreport|home|license|logo|memory|mozilla|networking|newtab|performance|plugins|preferences|privatebrowsing|profiles|rights|robots|searchreset|serviceworkers|support|sync-log|telemetry|webrtc)?$/i;

    return website.test(string) || aboutpage.test(string);
  }
};

const main = () => {
  newtaboverride.init();

  simplePrefs.on('', newtaboverride.onPrefChange);
  prefsTarget.on('homepage', newtaboverride.onPrefChange);
};

const unload = (reason) => {
  if (reason === 'uninstall' || reason === 'disable') {
    clearInterval(newtaboverride.timer);
    newtaboverride.lastClipboardUrl = false;
    newTabUrlJsm.reset();
  }
};

exports.main = main;
exports.onUnload = unload;
