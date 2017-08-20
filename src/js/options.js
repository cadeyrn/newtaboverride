'use strict';

/* global defaults */

const FEED_PERMISSION = { origins : ['https://www.soeren-hentzschel.at/*'] };

// a not very advanved regex to match most URLs…
const URI_REGEX = /^https?:\/\/(.*)/i;

const elBackgroundColor = document.getElementById('background-color');
const elBackgroundColorOption = document.getElementById('background-color-option');
const elClearOption = document.getElementById('clear-option');
const elCompatNotice = document.getElementById('compat-notice');
const elDefaultOption = document.getElementById('default-option');
const elFeedPermission = document.getElementById('feed-permission-container');
const elFeedPermissionBtn = document.getElementById('feed-permission');
const elFeedPermissionRevoke = document.getElementById('feed-permission-revoke-container');
const elFeedPermissionRevokeBtn = document.getElementById('feed-permission-revoke');
const elFocusOption = document.getElementById('focus-option');
const elFocusWebsite = document.getElementById('focus-website');
const elLocalFile = document.getElementById('local-file');
const elLocalFileOption = document.getElementById('local-file-option');
const elType = document.getElementById('type');
const elUrl = document.getElementById('url');
const elUrlOption = document.getElementById('url-option');
const elUrlWrapper = document.getElementById('url-wrapper');

/**
 * @exports options
 */
const options = {
  /**
   * prepend "http://" to string if the string does not start with "http://" or "https://"
   *
   * @param {string} string - string to check
   *
   * @returns {string} - URL with protocol
   */
  getValidUri (string) {
    if (!URI_REGEX.test(string) && string !== '' && string !== 'about:blank' && string !== 'about:home') {
      return 'http://' + string;
    }

    return string;
  },

  /**
   * This method handles the visibilty of the sub sections of some options.
   *
   * @returns {void}
   */
  toggleOptionsDetails () {
    let showDisableNotice = false;
    let showUrlOption = false;
    let showFocusOption = false;
    let showClearOption = false;
    let showBackgroundColorOption = false;
    let showLocalFileOption = false;

    // default new tab page
    if (elType.options[elType.selectedIndex].value === 'default') {
      showDisableNotice = true;
    }

    // about:home
    if (elType.options[elType.selectedIndex].value === 'about:home') {
      showFocusOption = true;
    }

    // custom url
    if (elType.options[elType.selectedIndex].value === 'custom_url') {
      showUrlOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    // background color
    if (elType.options[elType.selectedIndex].value === 'background_color') {
      showBackgroundColorOption = true;
      showClearOption = true;
    }

    // local file
    if (elType.options[elType.selectedIndex].value === 'local_file') {
      showLocalFileOption = true;
    }

    options.toggleVisibility(elDefaultOption, showDisableNotice);
    options.toggleVisibility(elUrlOption, showUrlOption);
    options.toggleVisibility(elFocusOption, showFocusOption);
    options.toggleVisibility(elClearOption, showClearOption);
    options.toggleVisibility(elBackgroundColorOption, showBackgroundColorOption);
    options.toggleVisibility(elLocalFileOption, showLocalFileOption);
  },

  /**
   * This method is used to make an DOM element either visible or invisible based on a given condition.
   *
   * @param {HTMLElement} el - the DOM element which should be visible or hidden
   * @param {boolean} condition - whether the element should be visible or hidden
   *
   * @returns {void}
   */
  toggleVisibility (el, condition) {
    condition ? el.classList.remove('hidden') : el.classList.add('hidden');
  },

  /**
   * Fired when the initial HTML document has been completely loaded and parsed. This method is used to load the
   * current options.
   *
   * @returns {void}
   */
  async load () {
    const option = await browser.storage.local.get(defaults);

    elFocusWebsite.checked = option.focus_website;
    elType.querySelector('[value="' + option.type + '"]').selected = true;
    elUrl.value = option.url;
    elBackgroundColor.value = option.background_color;
    options.toggleOptionsDetails();

    if (option.type === 'feed') {
      options.testFeedPermission();
    }

    // only for updates from the legacy add-on
    if (option.show_compat_notice === true) {
      elCompatNotice.classList.remove('hidden');
    }
  },

  /**
   * Checks if the permission for reading the feed is granted. If so it shows the option to revoke the permission.
   * Otherwise it shows the option to grant the permission.
   *
   * @returns {void}
   */
  async testFeedPermission () {
    const isAllowed = await browser.permissions.contains(FEED_PERMISSION);

    if (isAllowed) {
      elFeedPermissionRevoke.classList.remove('hidden');
    }
    else {
      elFeedPermission.classList.remove('hidden');
    }
  },

  /**
   * This method is used to request and to grant the permission.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  async requestFeedPermission (e) {
    e.preventDefault();

    const granted = await browser.permissions.request(FEED_PERMISSION);

    if (granted) {
      elFeedPermission.classList.add('hidden');
      elFeedPermissionRevoke.classList.remove('hidden');
    }
  },

  /**
   * This method is used to remove the permission.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  async revokeFeedPermission (e) {
    e.preventDefault();

    const revoked = await browser.permissions.remove(FEED_PERMISSION);

    if (revoked) {
      elFeedPermission.classList.remove('hidden');
      elFeedPermissionRevoke.classList.add('hidden');
    }
  }
};

document.addEventListener('DOMContentLoaded', options.load);
elFeedPermissionBtn.addEventListener('click', options.requestFeedPermission);
elFeedPermissionRevokeBtn.addEventListener('click', options.revokeFeedPermission);

elFocusWebsite.addEventListener('change', (e) => {
  browser.storage.local.set({ focus_website : e.target.checked });
});

elType.addEventListener('change', (e) => {
  if (e.target.value === 'feed') {
    options.testFeedPermission();
  }
  else {
    elFeedPermission.classList.add('hidden');
    elFeedPermissionRevoke.classList.add('hidden');
  }

  browser.storage.local.set({ type : e.target.value });
  options.toggleOptionsDetails();
});

elUrl.addEventListener('input', (e) => {
  // local file access is not allowed for WebExtensions
  if (e.target.value.startsWith('file://')) {
    elUrl.classList.add('error');
    elUrlWrapper.querySelector('.error-message.file').classList.remove('hidden');
  }
  // set url
  else {
    elUrl.classList.remove('error');
    elUrlWrapper.querySelector('.error-message.file').classList.add('hidden');

    browser.storage.local.set({ url : options.getValidUri(e.target.value) });
  }
});

elBackgroundColor.addEventListener('input', (e) => {
  browser.storage.local.set({ background_color : e.target.value });
});

elLocalFile.addEventListener('change', () => {
  const reader = new FileReader();

  reader.readAsText(elLocalFile.files[0]);
  reader.addEventListener('loadend', () => {
    const file = reader.result;
    browser.storage.local.set({ local_file : file });
  });
});
