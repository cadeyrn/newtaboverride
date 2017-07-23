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
    browser.storage.local.get(defaults, options => {
      switch (options.type) {
        case 'about:blank':
        case 'about:home':
          browser.tabs.update({ url : options.type });
          break;
        case 'custom_url':
          browser.tabs.update({ url : options.url || 'about:blank' });
          break;
        default:
          // default handling?
      }
    });
  }
};

newtab.init();
