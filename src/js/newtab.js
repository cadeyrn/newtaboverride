'use strict';

/**
 * @exports newtab
 */
const newtab = {
  /**
   * This method is used to navigate to the set new tab page.
   *
   * @returns {void}
   */
  init () {
    browser.storage.local.get({ type : 'custom_url', url : '' }, options => {
      if (options.type === 'custom_url') {
        browser.tabs.update({ url : options.url });
      }
    });
  }
};

newtab.init();
