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

    switch (options.type) {
      case 'about:blank':
      case 'about:home':
        browser.tabs.update({ url : options.type });
        break;
      case 'custom_url':
        if (options.focus_website) {
          browser.tabs.getCurrent((tab) => {
            const tabId = tab.id;
            browser.tabs.create({ url : options.url || 'about:blank' }, () => {
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
  }
};

newtab.init();
