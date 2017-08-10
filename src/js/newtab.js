'use strict';

const FEED_PAGE = 'html/feed.html';

/**
 * @exports newtab
 */
const newtab = {
  /**
   * This method is used to navigate to the set new tab page.
   *
   * @returns {void}
   */
  init () {
    browser.storage.local.get(defaults, options => {
      switch (options.type) {
        case 'about:blank':
        case 'about:home':
          browser.tabs.update({ url : options.type });
          break;
        case 'custom_url':
          if (options.focus_website) {
            browser.tabs.getCurrent((tab) => {
              const tabId = tab.id;
              const created = browser.tabs.create({ 'url' : options.url || 'about:blank' });
              created.then(() => {
                browser.tabs.remove(tabId);
              });
            });
          }
          else {
            browser.tabs.update({ url : options.url || 'about:blank' });
          }
          break;
        case 'feed':
          browser.tabs.update({ url : browser.extension.getURL(FEED_PAGE) });
          break;
        default:
          browser.tabs.update({ url : 'about:blank' });
      }
    });
  }
};

newtab.init();
