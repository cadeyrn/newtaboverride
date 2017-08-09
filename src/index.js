const { viewFor } = require('sdk/view/core');
const simplePrefs = require('sdk/simple-prefs');
const tabs = require('sdk/tabs');
const tabutils = require('sdk/tabs/utils');

const newtaboverride = {
  onPrefChange : function () {
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
  simplePrefs.on('', newtaboverride.onPrefChange);
};

exports.main = main;
