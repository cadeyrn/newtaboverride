const { Cc, Ci } = require('chrome');
const { PrefsTarget } = require('sdk/preferences/event-target');
const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);
const simplePrefs = require('sdk/simple-prefs');
const preferencesService = require('sdk/preferences/service');
const prefsTarget = PrefsTarget({ branchName: 'browser.startup.'});

const newtaboverride = {
  init : function () {
    this.onPrefChange();
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

    aboutNewTabService.newTabURL = newTabUrl;
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
    aboutNewTabService.resetNewTabURL();
  }
};
