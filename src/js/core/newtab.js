'use strict';

/* global URI_REGEX, PERMISSION_HOMEPAGE, defaults, utils */

const BACKGROUND_COLOR_PAGE = 'html/background_color.html';
const HOME_PAGE_MISSING_PERMISSION = 'html/homepage_permission_needed.html';
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
    const url = options.type === 'about:home' || options.type === 'about:blank' ? options.type : options.url;

    switch (options.type) {
      case 'about:blank':
        newtab.openNewTabPage(url, false);
        break;
      case 'about:home':
      case 'custom_url':
        newtab.openNewTabPage(url, options.focus_website);
        break;
      case 'homepage':
        const isAllowed = await browser.permissions.contains(PERMISSION_HOMEPAGE);

        // a permission is needed
        if (isAllowed) {
          const homepage = await browser.browserSettings.homepageOverride.get({});
          const firstHomepage = homepage.value.split('|')[0];

          if (!URI_REGEX.test(firstHomepage)) {
            newtab.openNewTabPage('about:blank', false);
            break;
          }

          newtab.openNewTabPage(firstHomepage, options.focus_website);
        }
        // no permission granted
        else {
          newtab.openNewTabPage(browser.extension.getURL(HOME_PAGE_MISSING_PERMISSION), options.focus_website);
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
        newtab.openNewTabPage('about:blank', false);
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
    await browser.tabs.getCurrent((tab) => {
      let tabId = tab.id;

      // Mozilla broke about:blank in Firefox 60 and the only way to work around the "about:blank" is the address bar
      // is to create an error…
      if (url === 'about:blank') {
        tabId = undefinedVariable;
      }

      // set focus on website
      if (focus_website) {
        // we need to pass the cookieStoreId to support the container tabs feature of Firefox
        browser.tabs.create({ url : url || 'about:blank', cookieStoreId : tab.cookieStoreId }, () => {
          browser.tabs.remove(tabId);
        });
      }
      // set focus on address bar
      else {
        // we explicitly set the tab id of the current tab to support the edge case of opening a new tab in the
        // background, for support of add-ons like Gesturefy; we set loadReplace to true to disable the back button
        browser.tabs.update(tab.id, { url : url || 'about:blank', loadReplace : true }, () => {
          // there is nothing to do, but it's needed, otherwise browser.history.deleteUrl() does not work
        });
      }
    });

    // delete spammy new tab page entry from history
    browser.history.deleteUrl({ url : browser.extension.getURL(NEW_TAB_PAGE) });
  }
};

newtab.init();
