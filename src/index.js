const NEW_API_FIREFOX_VERSION = 44;

const { PrefsTarget } = require('sdk/preferences/event-target');
const { version } = require('sdk/system/xul-app');
const simplePrefs = require('sdk/simple-prefs');
const preferencesService = require('sdk/preferences/service');
const prefsTarget = PrefsTarget({ branchName: 'browser.startup.'});

const newtaboverride = {
  init : function () {
    newtaboverride.onPrefChange();
  },

  override : function (newTabUrl) {
    if (version < NEW_API_FIREFOX_VERSION) {
      require('resource:///modules/NewTabURL.jsm').NewTabURL.override(newTabUrl);
    } else {
      const { Cc, Ci } = require('chrome');
      const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);

      aboutNewTabService.newTabURL = newTabUrl;
    }
  },

  reset : function () {
    if (version < NEW_API_FIREFOX_VERSION) {
      require('resource:///modules/NewTabURL.jsm').NewTabURL.reset();
    } else {
      const { Cc, Ci } = require('chrome');
      const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);

      aboutNewTabService.resetNewTabURL();
    }
  },
  
  onPrefChange : function () {
    var type = simplePrefs.prefs['type'];
    var newTabUrl;

    switch (type) {
      case 'about:blank':
      case 'about:home':
      case 'about:newtab':
        newTabUrl = type;
        break;
      case 'custom_url':
        newTabUrl = simplePrefs.prefs['url'];
        break;
      case 'homepage':
        var homepage = preferencesService.get('browser.startup.homepage', 'about:blank').split('|')[0];
        newTabUrl = homepage;
        break;
      default:
        newTabUrl = 'about:newtab';
    }

    newtaboverride.override(newTabUrl);
  }
};

const main = () => {
  newtaboverride.init();
  simplePrefs.on('', newtaboverride.onPrefChange);
  prefsTarget.on('homepage', newtaboverride.onPrefChange);
};

exports.main = main;

exports.onUnload = function (reason) {
  if (reason === 'uninstall' || reason === 'disable') {
    newtaboverride.reset();
  }
};
