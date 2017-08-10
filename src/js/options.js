'use strict';

const FEED_PERMISSION = { origins : ['https://www.soeren-hentzschel.at/*'] };

/**
 * @see http://stackoverflow.com/a/9284473
 */
const URI_REGEX = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

const elCompatNotice = document.getElementById('compat-notice');
const elDefaultOption = document.getElementById('default_option');
const elFeedPermission = document.getElementById('feed_permission_container');
const elFeedPermissionBtn = document.getElementById('feed_permission');
const elFeedPermissionRevoke = document.getElementById('feed_permission_revoke_container');
const elFeedPermissionRevokeBtn = document.getElementById('feed_permission_revoke');
const elFocusWebsite = document.getElementById('focus_website');
const elType = document.getElementById('type');
const elUrl = document.getElementById('url');
const elUrlOption = document.getElementById('url_option');
const elUrlWrapper = document.getElementById('url-wrapper');

/**
 * @exports options
 */
const options = {
  isValidUri (string) {
    return URI_REGEX.test(string) || string === '' || string === 'about:blank';
  },

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

    elFocusWebsite.checked = option.focus_website;
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
  if (options.isValidUri(e.target.value)) {
    elUrl.classList.remove('error');
    elUrlWrapper.querySelector('.error-message').classList.add('hidden');

    browser.storage.local.set({ url : e.target.value });
  }
  else {
    elUrl.classList.add('error');

    if (e.target.value.startsWith('file://')) {
      elUrlWrapper.querySelector('.error-message.default').classList.add('hidden');
      elUrlWrapper.querySelector('.error-message.file').classList.remove('hidden');
    }
    else {
      elUrlWrapper.querySelector('.error-message.default').classList.remove('hidden');
      elUrlWrapper.querySelector('.error-message.file').classList.add('hidden');
    }

    browser.storage.local.set({ url : 'about:blank' });
  }
});
