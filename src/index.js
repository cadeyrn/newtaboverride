const {Cc, Ci} = require('chrome');
const preferences = require('sdk/simple-prefs');
const aboutNewTabService = Cc['@mozilla.org/browser/aboutnewtab-service;1'].getService(Ci.nsIAboutNewTabService);

const newtaboverride = {
  init : function () {
    this.onPrefChange();
  },
  
  onPrefChange : function () {
    aboutNewTabService.newTabURL = preferences.prefs['url'] || 'about:newtab';
  }
};

const main = () => {
  newtaboverride.init();
  preferences.on('url', newtaboverride.onPrefChange);
};

exports.main = main;

exports.onUnload = function (reason) {
  if (reason === 'uninstall' || reason === 'disable') {
    aboutNewTabService.resetNewTabURL();
  }
};
