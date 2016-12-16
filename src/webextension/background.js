'use strict';

const newtaboverride = {
  openOptionsPage : function () {
    browser.runtime.openOptionsPage();
  },

  openNewTabPage : function () {
    browser.storage.local.get('type', function (result) {
      let newTabUrl;

      switch (result.type) {
        case 'about:blank':
        case 'about:home':
        //case 'about:newtab':
        //case 'about:sync-tabs': // not supported in WebExtension
          newTabUrl = result.type;
          break;
        case 'clipboard':
          //newTabUrl = 'about:blank';
          // unfortunately there is no 'clipboard changed' event…
          //newtaboverride.timer = setInterval(newtaboverride.clipboardAction, CLIPBOARD_INTERVAL_IN_MILLISECONDS);
          console.log('not yet implemented');
          break;
        case 'custom_url':
          browser.storage.local.get('url', function (result) {
            if (result.url === '') {
              newTabUrl = 'about:blank';
            } else {
              newTabUrl = result.url;
            }
          });
          break;
        case 'homepage':
          //newTabUrl = preferencesService.getLocalized('browser.startup.homepage', 'about:blank').split('|')[0];
          console.log('not yet implemented');
          break;
        case 'feed':
          //newTabUrl = ABOUT_FEED_URI;
          console.log('not yet implemented');
          break;
        default:
          newTabUrl = 'about:newtab';
      }

      browser.tabs.query({currentWindow : true, active : true}, function (tab) {
        browser.tabs.update(tab.id, {url : newTabUrl})
      });
    });
  }
};

browser.browserAction.onClicked.addListener(newtaboverride.openOptionsPage);
browser.tabs.onCreated.addListener(newtaboverride.openNewTabPage);

const port = browser.runtime.connect({name : 'sync-legacy-data'});
port.onMessage.addListener((msg) => {
  if (msg) {
    browser.storage.local.set(msg);
  }
});
