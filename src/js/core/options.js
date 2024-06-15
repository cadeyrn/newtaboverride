'use strict';

/* global URI_REGEX, PERMISSION_FEED, PROTOCOL_REGEX, defaults, permissions */

const elBackgroundColor = document.getElementById('background-color');
const elBackgroundColorOption = document.getElementById('background-color-option');
const elClearOption = document.getElementById('clear-option');
const elFeedPermission = document.getElementById('feed-permission-container');
const elFeedPermissionBtn = document.getElementById('feed-permission');
const elFeedPermissionRevoke = document.getElementById('feed-permission-revoke-container');
const elFeedPermissionRevokeBtn = document.getElementById('feed-permission-revoke');
const elFocusOption = document.getElementById('focus-option');
const elFocusWebsite = document.getElementById('focus-website');
const elHomepageOption = document.getElementById('homepage-option');
const elLocalFile = document.getElementById('local-file');
const elLocalFileDeleteLink = document.getElementById('delete-local-file');
const elLocalFileOption = document.getElementById('local-file-option');
const elTabPosition = document.getElementById('tab-position');
const elType = document.getElementById('type');
const elUrl = document.getElementById('url');
const elUrlOption = document.getElementById('url-option');
const elUrlWrapper = document.getElementById('url-wrapper');

/**
 * @exports options
 */
const options = {
  /**
   * This method handles the visibility of the subsections of some options.
   *
   * @returns {void}
   */
  async toggleOptionsDetails () {
    let showUrlOption = false;
    let showHomepageOption = false;
    let showFocusOption = false;
    let showClearOption = false;
    let showBackgroundColorOption = false;
    let showLocalFileOption = false;
    let showLocalFileDeleteLink = false;

    // home page
    if (elType.options[elType.selectedIndex].value === 'homepage') {
      showHomepageOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    // custom url
    if (elType.options[elType.selectedIndex].value === 'custom_url') {
      showUrlOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    // local file
    if (elType.options[elType.selectedIndex].value === 'local_file') {
      showLocalFileOption = true;
      showFocusOption = true;
      showClearOption = true;

      const { local_file } = await browser.storage.local.get({ local_file : defaults.local_file });
      if (local_file) {
        showLocalFileDeleteLink = true;
      }
    }

    // background color
    if (elType.options[elType.selectedIndex].value === 'background_color') {
      showBackgroundColorOption = true;
      showFocusOption = false;
      showClearOption = true;
    }

    // feed
    if (elType.options[elType.selectedIndex].value === 'feed') {
      showFocusOption = true;
      showClearOption = true;
    }

    options.toggleVisibility(elUrlOption, showUrlOption);
    options.toggleVisibility(elHomepageOption, showHomepageOption);
    options.toggleVisibility(elFocusOption, showFocusOption);
    options.toggleVisibility(elClearOption, showClearOption);
    options.toggleVisibility(elBackgroundColorOption, showBackgroundColorOption);
    options.toggleVisibility(elLocalFileOption, showLocalFileOption);
    options.toggleVisibility(elLocalFileDeleteLink, showLocalFileDeleteLink);
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
    const tabPosition = await browser.browserSettings.newTabPosition.get({});

    elFocusWebsite.checked = option.focus_website;
    elType.querySelector('[value="' + option.type + '"]').selected = true;
    elTabPosition.querySelector('[value="' + tabPosition.value + '"]').selected = true;
    elUrl.value = option.url;
    elBackgroundColor.value = option.background_color;
    options.toggleOptionsDetails();

    if (option.type === 'feed') {
      permissions.testPermission(PERMISSION_FEED, elFeedPermission, elFeedPermissionRevoke);
    }

    if (elUrl.value === '') {
      elUrl.classList.add('error');
      elUrlWrapper.querySelector('.error-message.default').classList.remove('hidden');
    }
  }
};

document.addEventListener('DOMContentLoaded', options.load);

permissions.setupListeners({
  permission : PERMISSION_FEED,
  elGrantPermissionContainer : elFeedPermission,
  elRevokePermissionContainer : elFeedPermissionRevoke,
  elGrantBtn : elFeedPermissionBtn,
  elRevokeBtn : elFeedPermissionRevokeBtn
});

elFocusWebsite.addEventListener('change', (e) => {
  browser.storage.local.set({ focus_website : e.target.checked });
});

elType.addEventListener('change', (e) => {
  if (e.target.value === 'feed') {
    permissions.testPermission(PERMISSION_FEED, elFeedPermission, elFeedPermissionRevoke);
  }
  else {
    elFeedPermission.classList.add('hidden');
    elFeedPermissionRevoke.classList.add('hidden');
  }

  browser.storage.local.set({ type : e.target.value });
  options.toggleOptionsDetails();
});

elTabPosition.addEventListener('change', (e) => {
  browser.browserSettings.newTabPosition.set({ value : e.target.value });
});

elUrl.addEventListener('input', (e) => {
  let url = e.target.value.trim();

  // valid URL
  if (URI_REGEX.test(url)) {
    elUrlWrapper.querySelector('.error-message').classList.add('hidden');
    elUrl.classList.remove('error');
  }
  // local file access is not allowed for WebExtensions
  else if (url.startsWith('file://')) {
    elUrlWrapper.querySelector('.error-message.default').classList.add('hidden');
    elUrlWrapper.querySelector('.error-message.file').classList.remove('hidden');
    elUrl.classList.add('error');
  }
  // unsupported protocol or empty URL
  else if (PROTOCOL_REGEX.test(url) || url === '') {
    elUrlWrapper.querySelector('.error-message.default').classList.remove('hidden');
    elUrlWrapper.querySelector('.error-message.file').classList.add('hidden');
    elUrl.classList.add('error');
  }
  // prepend https:// for every other input
  else {
    url = 'https://' + url;
  }

  browser.storage.local.set({ url });
});

elUrl.dispatchEvent(new CustomEvent('input'));

elBackgroundColor.addEventListener('input', (e) => {
  browser.storage.local.set({ background_color : e.target.value });
});

elLocalFile.addEventListener('change', () => {
  const reader = new FileReader();

  reader.readAsText(elLocalFile.files[0]);
  reader.addEventListener('loadend', async () => {
    const file = reader.result;

    await browser.storage.local.set({ local_file : file });
    options.toggleVisibility(elLocalFileDeleteLink, true);
  });
});

elLocalFileDeleteLink.addEventListener('click', (e) => {
  e.preventDefault();

  // eslint-disable-next-line no-alert
  if (!confirm(e.target.getAttribute('data-confirm'))) {
    return;
  }

  browser.storage.local.set({ local_file : '' });
  options.toggleVisibility(elLocalFileDeleteLink, false);
});
