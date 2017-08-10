'use strict';

const FEED_PAGE = 'html/feed.html';

/**
 * @see http://stackoverflow.com/a/9284473
 */
const URI_REGEX = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

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
          const newTabUrl = newtab.isValidUri(options.url) ? options.url : 'about:blank';
          if (options.focus_website) {
            browser.tabs.getCurrent((tab) => {
              const tabId = tab.id;
              const created = browser.tabs.create({ 'url' : newTabUrl });
              created.then(() => {
                browser.tabs.remove(tabId);
              });
            });
          }
          else {
            browser.tabs.update({ url : newTabUrl });
          }
          break;
        case 'feed':
          browser.tabs.update({ url : browser.extension.getURL(FEED_PAGE) });
          break;
        default:
          browser.tabs.update({ url : 'about:blank' });
      }
    });
  },

  isValidUri (string) {
    return URI_REGEX.test(string);
  }
};

newtab.init();
