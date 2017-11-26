'use strict';

/* global defaults, utils */

const BACKGROUND_COLOR_PAGE = 'background_color.html';
const HOME_PAGE_MISSING_PERMISSION = 'homepage_permission_needed.html';
const LOCAL_FILE_MISSING_PAGE = 'local_file_missing.html';
const FEED_PAGE = 'feed.html';
const NEW_TAB_PAGE = 'newtab.html';

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
    const url = options.type === 'about:home' ? options.type : options.url;

    switch (options.type) {
      case 'about:blank':
        document.querySelector('iframe').src = 'about:blank';
        break;
      case 'about:home':
      case 'custom_url':
        document.location = url;
        break;
      case 'homepage':
        const isAllowed = await browser.permissions.contains(PERMISSION_HOMEPAGE);

        // a permission is needed
        if (isAllowed) {
          const homepage = await browser.browserSettings.homepageOverride.get({});
          const firstHomepage = homepage.value.split('|')[0];

          if (!URI_REGEX.test(firstHomepage)) {
            document.querySelector('iframe').src = 'about:blank';
            break;
          }
          document.querySelector('iframe').src = firstHomepage;
        }
        // no permission granted
        else {
          document.querySelector('iframe').src = browser.extension.getURL(HOME_PAGE_MISSING_PERMISSION);
        }

        break;
      case 'background_color':
        const { background_color } = await browser.storage.local.get({ background_color : defaults.background_color });
        document.body.style.background = background_color;
        break;
      case 'feed':
        document.querySelector('iframe').src = FEED_PAGE;
        break;
      case 'local_file':
        if (options.local_file) {
          const { local_file } = await browser.storage.local.get({ local_file : defaults.local_file });
          document.documentElement.innerHTML = local_file;
        } else {
          document.querySelector('iframe').src = LOCAL_FILE_MISSING_PAGE;
        }
        break;
      default:
        document.querySelector('iframe').src = 'about:blank';
    }
  }
};

newtab.init();
