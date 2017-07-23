'use strict';

const UI_PAGE = 'html/options.html';

/**
 * @exports newtaboverride
 */
const newtaboverride = {
  /**
   * Fired when the toolbar icon is clicked. This method is used to open the user interface in a new tab or to switch
   * to the tab with the user interface if the user interface is already opened.
   *
   * @returns {void}
   */
  openUserInterface () {
    const url = browser.extension.getURL(UI_PAGE);

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
