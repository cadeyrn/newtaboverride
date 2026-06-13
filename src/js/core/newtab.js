'use strict';

/* global Defaults, Utils */

class NewTab {
  static #localFilePage = 'html/local_file.html';

  static #localFileMissingPage = 'html/local_file_missing.html';

  static #feedPage = 'html/feed.html';

  static #newTabPage = 'html/newtab.html';

  /**
   * This method is used to navigate to the set new tab page.
   *
   * @returns {void}
   */
  static async init () {
    const options = await browser.storage.local.get(Defaults.values);

    switch (options.type) {
      case 'custom_url':
        let { url } = options;

        if (url.indexOf('|') > -1) {
          const urls = options.url.split('|');
          const randIndex = Math.floor(Math.random() * urls.length);
          url = urls[randIndex].trim();
        }

        // return early if there is no valid url
        if (!Utils.uriRegex.test(url)) {
          NewTab.#openNewTabPage('', false);
          break;
        }

        NewTab.#openNewTabPage(url, options.focus_website);
        break;
      case 'homepage':
        const homepage = await browser.browserSettings.homepageOverride.get({});
        const firstHomepage = homepage.value.split('|')[0];

        if (!Utils.uriRegex.test(firstHomepage)) {
          NewTab.#openNewTabPage('https://' + firstHomepage, false);
          break;
        }

        NewTab.#openNewTabPage(firstHomepage, options.focus_website);
        break;
      case 'background_color':
        const { background_color } = await browser.storage.local.get({ background_color: Defaults.values.background_color });
        document.body.style.background = background_color;
        break;
      case 'feed':
        NewTab.#openNewTabPage(browser.runtime.getURL(NewTab.#feedPage), options.focus_website);
        break;
      case 'local_file':
        if (options.local_file) {
          NewTab.#openNewTabPage(browser.runtime.getURL(NewTab.#localFilePage), options.focus_website);
        }
        else {
          NewTab.#openNewTabPage(browser.runtime.getURL(NewTab.#localFileMissingPage), options.focus_website);
        }
        break;
      default:
        NewTab.#openNewTabPage('', false);
    }
  }

  /**
   * This method is used to set the focus either on the address bar or on the web page.
   *
   * @param {string} url - url to open
   * @param {boolean} focus_website - whether the focus should be on the web page instead of the address bar
   *
   * @returns {void}
   */
  static async #openNewTabPage (url, focus_website) {
    if (url.trim() === '') {
      /* eslint-disable-next-line no-param-reassign */
      url = browser.runtime.getURL('html/options.html');
    }

    await browser.tabs.getCurrent(tab => {
      const tabId = tab.id;

      // set focus on website
      if (focus_website) {
        // pass the cookieStoreId to support container tabs in Firefox
        browser.tabs.create({ url: url, cookieStoreId: tab.cookieStoreId }, () => {
          browser.tabs.remove(tabId);
        });
      }
      // set focus on address bar
      else {
        // use loadReplace to keep the back button disabled and to support background new-tab flows from add-ons
        browser.tabs.update(tabId, { url: url, loadReplace: true }, () => {
          // there is nothing to do, but it's needed, otherwise browser.history.deleteUrl() does not work
        });
      }
    });

    // delete the internal new tab page entry from history after redirecting
    browser.history.deleteUrl({ url: browser.runtime.getURL(NewTab.#newTabPage) });
  }
}

NewTab.init();
