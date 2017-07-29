'use strict';

const OPTIONS_PAGE = 'html/options.html';

/**
 * @exports newtaboverride
 */
const newtaboverride = {
  /**
   * Fired when the extension is first installed, when the extension is updated to a new version or when the browser
   * is updated to a new version. We want to show a badge on our toolbar icon when the extension is first installed
   * or if an older version is detected.
   *
   * @param {runtime.OnInstalledReason} details - details.reason contains the reason why this event is being dispatched
   *
   * @returns {void}
   */
  onInstalledHandler (details) {
    if (details.reason === 'install' || details.reason === 'update') {
      browser.browserAction.setBadgeText({ text : '★' });
    }
  },

  /**
   * Fired when the toolbar icon is clicked. This method is used to open the user interface in a new tab or to switch
   * to the tab with the user interface if the user interface is already opened.
   *
   * @returns {void}
   */
  openUserInterface () {
    const url = browser.extension.getURL(OPTIONS_PAGE);

    browser.browserAction.setBadgeText({ text : '' });
    browser.tabs.query({}, (tabs) => {
      let tabId = null;

      for (const tab of tabs) {
        if (tab.url === url) {
          tabId = tab.id;
          break;
        }
      }

      if (tabId) {
        browser.tabs.update(tabId, { active : true });
      }
      else {
        browser.tabs.create({ url });
      }
    });
  }
};

browser.browserAction.onClicked.addListener(newtaboverride.openUserInterface);
browser.runtime.onInstalled.addListener(newtaboverride.onInstalledHandler);
