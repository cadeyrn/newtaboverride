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
  }
};

const main = () => {
  simplePrefs.on('', newtaboverride.onPrefChange);
};

exports.main = main;
