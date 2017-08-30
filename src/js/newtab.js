'use strict';

/* global defaults */

const BACKGROUND_COLOR_PAGE = 'html/background_color.html';
const LOCAL_FILE_PAGE = 'html/local_file.html';
const LOCAL_FILE_MISSING_PAGE = 'html/local_file_missing.html';
const FEED_PAGE = 'html/feed.html';
const NEW_TAB_PAGE = 'html/newtab.html';

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
        newtab.openNewTabPage(url, options.focus_website);
        break;
      case 'background_color':
        newtab.openNewTabPage(browser.extension.getURL(BACKGROUND_COLOR_PAGE), options.focus_website);
        break;
      case 'feed':
        newtab.openNewTabPage(browser.extension.getURL(FEED_PAGE), options.focus_website);
        break;
      case 'local_file':
        if (options.local_file) {
          newtab.openNewTabPage(browser.extension.getURL(LOCAL_FILE_PAGE), options.focus_website);
        }
        else {
          newtab.openNewTabPage(browser.extension.getURL(LOCAL_FILE_MISSING_PAGE), options.focus_website);
        }
        break;
      default:
        browser.tabs.update({ url : 'about:blank' });
    }
  },

  /**
   * This method is used to set the focus either on the address bar or on the web page.
   *
   * @param {string} url - url to open
   * @param {boolean} focus_website - whether the focus should be on the web page instead of the address bar
   *
   * @returns {void}
   */
  async openNewTabPage (url, focus_website) {
    // set focus on website
    if (focus_website) {
      await browser.tabs.getCurrent((tab) => {
        const tabId = tab.id;
        browser.tabs.create({ url : url || 'about:blank' }, () => {
          browser.tabs.remove(tabId);
        });
      });

      // delete spammy new tab page entry from history (only works for browser.tabs.create() at the moment)
      browser.history.deleteUrl({ url : browser.extension.getURL(NEW_TAB_PAGE) });
    }
    // set focus on address bar
    else {
      browser.tabs.update({ url : url || 'about:blank' });
    }
  }
};

newtab.init();
