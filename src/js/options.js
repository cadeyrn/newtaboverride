'use strict';

const FEED_PERMISSION = { origins : ['https://www.soeren-hentzschel.at/*'] };

const elFeedPermission = document.getElementById('feed_permission_container');
const elFeedPermissionBtn = document.getElementById('feed_permission');
const elType = document.getElementById('type');
const elUrlOption = document.getElementById('url_option');
const elUrl = document.getElementById('url');

/**
 * @exports options
 */
const options = {
  toggleUrlOption () {
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
    options.toggleUrlOption();

    if (option.type === 'feed') {
      options.testFeedPermission();
    }
  },

  async testFeedPermission () {
    const isAllowed = await browser.permissions.contains(FEED_PERMISSION);

    if (!isAllowed) {
      elFeedPermission.classList.remove('hidden');
      elFeedPermissionBtn.addEventListener('click', options.requestFeedPermission);
    }
  },

  async requestFeedPermission (e) {
    e.preventDefault();

    const granted = await browser.permissions.request(FEED_PERMISSION);

    if (granted) {
      elFeedPermission.classList.add('hidden');
    }
  }
};

document.addEventListener('DOMContentLoaded', options.load);

elType.addEventListener('change', (e) => {
  if (e.target.value === 'feed') {
    options.testFeedPermission();
  }
  else {
    elFeedPermission.classList.add('hidden');
  }

  browser.storage.local.set({ type : e.target.value });
  options.toggleUrlOption();
});

elUrl.addEventListener('input', (e) => {
  browser.storage.local.set({ url : e.target.value });
});
