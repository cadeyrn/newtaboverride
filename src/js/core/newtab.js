'use strict';

/* global Settings, Utils */

class NewTab {
  /**
   * Internal page used to render locally stored files
   *
   * @type {string}
   */
  static #localFilePage = 'html/local_file.html';

  /**
   * Internal fallback page shown when no local file has been stored
   *
   * @type {string}
   */
  static #localFileMissingPage = 'html/local_file_missing.html';

  /**
   * Internal page used to render the feed view
   *
   * @type {string}
   */
  static #feedPage = 'html/feed.html';

  /**
   * This method is used to navigate to the set new tab page.
   *
   * @returns {Promise<void>}
   */
  static async init () {
    const [settings, tab] = await Promise.all([
      Settings.get(),
      browser.tabs.getCurrent()
    ]);
    const { managedKeys, values: options } = settings;
    let contextTab = null;
    const hasContainerRules = Object.keys(options.context_rules.containers).length > 0;
    const hasUrlRules = hasContainerRules || Object.keys(options.context_rules.groups).length > 0;

    if (tab && hasContainerRules) {
      if (tab.openerTabId > 0) {
        contextTab = await browser.tabs.get(tab.openerTabId);
      }

      // Firefox may create the temporary internal new tab page in the default container even though the user opened
      // the tab from a container tab. Use the previously active tab only to resolve URL rules; the replacement tab
      // still keeps the container Firefox chose for the temporary new tab.
      if (!contextTab && tab.cookieStoreId === 'firefox-default') {
        const tabs = await browser.tabs.query({ windowId: tab.windowId });
        const otherTabs = tabs.filter(candidate => candidate.id !== tab.id);
        const contextTabFromSuccessor = otherTabs.find(candidate => candidate.successorTabId === tab.id);

        if (contextTabFromSuccessor) {
          contextTab = contextTabFromSuccessor;
        }
        else {
          contextTab = otherTabs.sort((a, b) => b.lastAccessed - a.lastAccessed)[0] ?? null;
        }
      }
    }

    let { type, url } = options;
    const contextUrl = await NewTab.#findContextUrl(options, managedKeys, tab, contextTab);

    if (contextUrl) {
      type = 'custom_url';
      url = contextUrl;
    }

    switch (type) {
      case 'custom_url':
        if (url.indexOf('|') > -1) {
          const urls = url.split('|');
          const randIndex = Math.floor(Math.random() * urls.length);
          url = urls[randIndex].trim();
        }

        // return early if there is no valid url
        if (!Utils.uriRegex.test(url)) {
          const openOptionsPage = url.trim() !== '' || !hasUrlRules;

          await NewTab.#openNewTabPage('', false, tab, openOptionsPage);
          break;
        }

        await NewTab.#openNewTabPage(url, options.focus_website, tab);
        break;
      case 'homepage':
        const homepage = await browser.browserSettings.homepageOverride.get({});
        const firstHomepage = homepage.value.split('|')[0];

        if (!Utils.uriRegex.test(firstHomepage)) {
          await NewTab.#openNewTabPage('https://' + firstHomepage, false, tab);
          break;
        }

        await NewTab.#openNewTabPage(firstHomepage, options.focus_website, tab);
        break;
      case 'background_color':
        document.body.style.background = options.background_color;
        break;
      case 'feed':
        await NewTab.#openNewTabPage(browser.runtime.getURL(NewTab.#feedPage), options.focus_website, tab);
        break;
      case 'local_file':
        if (options.local_file) {
          await NewTab.#openNewTabPage(browser.runtime.getURL(NewTab.#localFilePage), options.focus_website, tab);
        }
        else {
          await NewTab.#openNewTabPage(browser.runtime.getURL(NewTab.#localFileMissingPage), options.focus_website, tab);
        }
        break;
      default:
        await NewTab.#openNewTabPage('', false, tab);
    }
  }

  /**
   * Find the URL assigned to the current tab group or container. Named tab group rules take precedence over container
   * rules. Local context rules must not override enterprise-managed new tab settings, but enterprise-managed context
   * rules may intentionally override the managed default URL.
   *
   * @param {object} options - current settings
   * @param {string[]} managedKeys - settings controlled by enterprise policies
   * @param {tabs.Tab|null} tab - temporary internal new tab page
   * @param {tabs.Tab|null} contextTab - source tab used to identify matching container rules
   *
   * @returns {Promise<string>} - matching context-specific URL or an empty string
   */
  static async #findContextUrl (options, managedKeys, tab, contextTab) {
    const hasManagedContextRules = managedKeys.includes('context_rules');

    if (options.type !== 'custom_url' ||
        (!hasManagedContextRules && (managedKeys.includes('type') || managedKeys.includes('url')))) {
      return '';
    }

    if (tab?.groupId > -1) {
      try {
        const group = await browser.tabGroups.get(tab.groupId);

        if (group.title && Object.hasOwn(options.context_rules.groups, group.title)) {
          return options.context_rules.groups[group.title];
        }
      }
      catch {
        // The group may disappear while the internal new tab page is loading.
      }
    }

    const cookieStoreId = contextTab?.cookieStoreId || tab?.cookieStoreId;

    if (cookieStoreId && Object.hasOwn(options.context_rules.containers, cookieStoreId)) {
      return options.context_rules.containers[cookieStoreId];
    }

    return '';
  }

  /**
   * This method is used to set the focus either on the address bar or on the web page.
   *
   * @param {string} url - url to open
   * @param {boolean} focus_website - whether the focus should be on the web page instead of the address bar
   * @param {tabs.Tab|null} tab - temporary internal new tab page
   * @param {boolean} openOptionsPage - whether an empty URL should open the settings page
   *
   * @returns {Promise<void>}
   */
  static async #openNewTabPage (url, focus_website, tab, openOptionsPage = true) {
    const newTabPageUrl = browser.runtime.getURL('html/newtab.html');

    if (url.trim() === '') {
      if (!openOptionsPage) {
        void browser.history.deleteUrl({ url: newTabPageUrl });

        return;
      }

      /* eslint-disable-next-line no-param-reassign */
      url = browser.runtime.getURL('html/options.html');
    }

    if (!tab) {
      void browser.history.deleteUrl({ url: newTabPageUrl });

      return;
    }

    // set focus on website
    if (focus_website) {
      // keep the replacement tab in the container Firefox chose for the temporary new tab. Copying the context tab or
      // opener would make unrelated new tabs look related again for Firefox and tab-management extensions
      const createdTabProperties = {
        url,
        index: tab.index,
        windowId: tab.windowId,
        cookieStoreId: tab.cookieStoreId
      };

      const createdTab = await browser.tabs.create(createdTabProperties);

      // if the temporary internal new tab page belongs to a tab group, move the replacement tab back into that
      // same group
      if (browser.tabs.group && tab.groupId > -1) {
        await browser.tabs.group({ groupId: tab.groupId, tabIds: createdTab.id });
      }

      // remember this window so the background script can remove the closed internal new tab page from the recently
      // closed tabs list again
      await browser.runtime.sendMessage({ type: 'forget-closed-new-tab', windowId: tab.windowId });
      void browser.history.deleteUrl({ url: newTabPageUrl });
      await browser.tabs.remove(tab.id);
    }
    // set focus on address bar
    else {
      // wait until Firefox has accepted the tab update before cleaning up the temporary newtab.html history entry,
      // running deleteUrl() immediately after tabs.update() may otherwise leave the internal page in history
      await browser.tabs.update(tab.id, { url, loadReplace: true });
      void browser.history.deleteUrl({ url: newTabPageUrl });
    }
  }
}

void NewTab.init();
