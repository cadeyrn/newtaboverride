'use strict';

const FEED_PERMISSION = { origins : ['https://www.soeren-hentzschel.at/*'] };

const elCompatNotice = document.getElementById('compat-notice');
const elDefaultOption = document.getElementById('default_option');
const elFeedPermission = document.getElementById('feed_permission_container');
const elFeedPermissionBtn = document.getElementById('feed_permission');
const elFeedPermissionRevoke = document.getElementById('feed_permission_revoke_container');
const elFeedPermissionRevokeBtn = document.getElementById('feed_permission_revoke');
const elType = document.getElementById('type');
const elUrlOption = document.getElementById('url_option');
const elUrl = document.getElementById('url');

/**
 * @exports options
 */
const options = {
  toggleOptionsDetails () {
    if (elType.options[elType.selectedIndex].value === 'default') {
      elDefaultOption.classList.remove('hidden');
    }
    else {
      elDefaultOption.classList.add('hidden');
    }

    if (elType.options[elType.selectedIndex].value === 'custom_url') {
      elUrlOption.classList.remove('hidden');
    }
    else {
      elUrlOption.classList.add('hidden');
    }
  },

  /**
   * Fired when the initial HTML document has been completely loaded and parsed. This method is used to load the
   * current options.
   *
   * @returns {void}
   */
  async load () {
    const option = await browser.storage.local.get(defaults);

    elType.querySelector('[value="' + option.type + '"]').selected = true;
    elUrl.value = option.url;
    options.toggleOptionsDetails();

    if (option.type === 'feed') {
      options.testFeedPermission();
    }

    if (option.show_compat_notice === true) {
      elCompatNotice.classList.remove('hidden');
    }
  },

  async testFeedPermission () {
    const isAllowed = await browser.permissions.contains(FEED_PERMISSION);

    if (isAllowed) {
      elFeedPermissionRevoke.classList.remove('hidden');
    }
    else {
      elFeedPermission.classList.remove('hidden');
    }
  },

  async requestFeedPermission (e) {
    e.preventDefault();

    const granted = await browser.permissions.request(FEED_PERMISSION);

    if (granted) {
      elFeedPermission.classList.add('hidden');
      elFeedPermissionRevoke.classList.remove('hidden');
    }
  },

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
  browser.storage.local.set({ url : e.target.value });
});
