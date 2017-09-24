'use strict';

/* global defaults, utils */

const BACKGROUND_COLOR_PAGE = 'html/background_color.html';
const LOCAL_FILE_PAGE = 'html/local_file.html';
const LOCAL_FILE_MISSING_PAGE = 'html/local_file_missing.html';
const FEED_PAGE = 'html/feed.html';
const NEW_TAB_PAGE = 'html/newtab.html';

/**
 * @exports newtab
 */
const newtab = {
  firefox57 : false,

  /**
   * This method is used to navigate to the set new tab page.
   *
   * @returns {void}
   */
  async init () {
    const browserInfo = await browser.runtime.getBrowserInfo();
    newtab.firefox57 = utils.parseVersion(browserInfo.version).major >= FIREFOX_57;

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
      case 'homepage':
        if (newtab.firefox57) {
          const homepage = await browser.browserSettings.homepageOverride.get({});
          const firstHomepage = homepage.value.split('|')[0];

          if (!URI_REGEX.test(firstHomepage)) {
            browser.tabs.update({ url : 'about:blank' });
            break;
          }

          newtab.openNewTabPage(firstHomepage, options.focus_website);
        }
        else {
          browser.tabs.update({ url : 'about:blank' });
        }

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
    }
    // set focus on address bar
    else {
      let options;

      // set loadReplace to true to disable the back button
      if (newtab.firefox57) {
        options = { url : url || 'about:blank', loadReplace : true };
      }
      // loadReplace is not available before Firefox 57
      else {
        options = { url : url || 'about:blank' };
      }

      await browser.tabs.update(options, () => {
        // there is nothing to do, but it's needed, otherwise browser.history.deleteUrl() does not work
      });
    }

    // delete spammy new tab page entry from history
    browser.history.deleteUrl({ url : browser.extension.getURL(NEW_TAB_PAGE) });
  }
};

newtab.init();
