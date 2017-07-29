const { PrefsTarget } = require('sdk/preferences/event-target');
const { viewFor } = require('sdk/view/core');
const newTabUrlJsm = require('resource:///modules/NewTabURL.jsm').NewTabURL;
const preferencesService = require('sdk/preferences/service');
const prefsTarget = PrefsTarget({ branchName: 'browser.startup.'});
const simplePrefs = require('sdk/simple-prefs');
const tabs = require('sdk/tabs');
const tabutils = require('sdk/tabs/utils');

const newtaboverride = {
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
      case 'homepage':
        newTabUrl = preferencesService.getLocalized('browser.startup.homepage', 'about:blank').split('|')[0];
        break;
      default:
        newTabUrl = 'about:newtab';
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
};

const main = () => {
  newtaboverride.init();

  simplePrefs.on('', newtaboverride.onPrefChange);
  prefsTarget.on('homepage', newtaboverride.onPrefChange);
};

const unload = (reason) => {
  if (reason === 'uninstall' || reason === 'disable') {
    newTabUrlJsm.reset();
  }
};

exports.main = main;
exports.onUnload = unload;
