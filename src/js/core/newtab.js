'use strict';

/* global Settings, Utils */

class NewTab {
  static #localFilePage = 'html/local_file.html';

  static #localFileMissingPage = 'html/local_file_missing.html';

  static #feedPage = 'html/feed.html';

  /**
   * This method is used to navigate to the set new tab page.
   *
   * @returns {void}
   */
  static async init () {
    const options = await Settings.get();

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
        document.body.style.background = options.background_color;
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

    const newTabPageUrl = browser.runtime.getURL('html/newtab.html');
    const tab = await browser.tabs.getCurrent();

    if (!tab) {
      browser.history.deleteUrl({ url: newTabPageUrl });

      return;
    }

    // set focus on website
    if (focus_website) {
      let sourceTab = null;

      if (tab.openerTabId > 0) {
        sourceTab = await browser.tabs.get(tab.openerTabId);
      }

      // Firefox may create the temporary internal new tab page in the default container even though the user opened
      // the tab from a container tab. Reusing the previously active tab as the source keeps the replacement tab in the
      // expected container and avoids an unnecessary reopen by other tab-management extensions.
      if (!sourceTab && tab.cookieStoreId === 'firefox-default') {
        const tabs = await browser.tabs.query({ windowId: tab.windowId });

        sourceTab = tabs.find(candidate => candidate.id !== tab.id && candidate.successorTabId === tab.id) ??
          tabs.filter(candidate => candidate.id !== tab.id).sort((a, b) => b.lastAccessed - a.lastAccessed)[0] ??
          null;
      }

      const createdTabProperties = {
        url,
        index: tab.index,
        windowId: tab.windowId,
        cookieStoreId: sourceTab?.cookieStoreId || tab.cookieStoreId
      };

      if (sourceTab) {
        createdTabProperties.openerTabId = sourceTab.id;
      }

      const createdTab = await browser.tabs.create(createdTabProperties);

      // if the temporary internal new tab page belongs to a tab group, move the replacement tab back into that
      // same group
      if (browser.tabs.group && tab.groupId > -1) {
        await browser.tabs.group({ groupId: tab.groupId, tabIds: createdTab.id });
      }

      // remember this window so the background script can remove the closed internal new tab page from the recently
      // closed tabs list again
      await browser.runtime.sendMessage({ type: 'forget-closed-new-tab', windowId: tab.windowId });
      browser.history.deleteUrl({ url: newTabPageUrl });
      await browser.tabs.remove(tab.id);
    }
    // set focus on address bar
    else {
      // use loadReplace to keep the back button disabled and to support background new-tab flows from add-ons
      browser.tabs.update(tab.id, { url, loadReplace: true }, () => {
        // this callback intentionally stays empty. Firefox may otherwise keep newtab.html in the browsing history when
        // browser.history.deleteUrl() runs right after browser.tabs.update()
      });
      browser.history.deleteUrl({ url: newTabPageUrl });
    }
  }
}

NewTab.init();
