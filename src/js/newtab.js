'use strict';

/* global defaults */

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
  async init () {
    const options = await browser.storage.local.get(defaults);
    const url = options.type === 'about:home' ? options.type : options.url;

    switch (options.type) {
      case 'about:blank':
        browser.tabs.update({ url : options.type });
        break;
      case 'about:home':
      case 'custom_url':
        // set focus on website
        if (options.focus_website) {
          browser.tabs.getCurrent((tab) => {
            const tabId = tab.id;
            browser.tabs.create({ url : url || 'about:blank' }, () => {
              browser.tabs.remove(tabId);
            });
          });
        }
        // set focus on address bar
        else {
          browser.tabs.update({ url : url || 'about:blank' });
        }
        break;
      case 'feed':
        browser.tabs.update({ url : browser.extension.getURL(FEED_PAGE) });
        break;
      default:
        browser.tabs.update({ url : 'about:blank' });
    }
  }
};

newtab.init();
