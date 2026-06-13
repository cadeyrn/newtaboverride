'use strict';

/* global Defaults, PermissionHelper, Utils */

class Options {
  // eslint-disable-next-line no-magic-numbers
  static #firefox137 = 137;

  static #changeSettingsShortcutButton = false;

  static #elements = {
    backgroundColor: document.getElementById('background-color'),
    backgroundColorOption: document.getElementById('background-color-option'),
    changeSettingsShortcutWrapper: document.getElementById('change-settings-shortcut-wrapper'),
    changeSettingsShortcut: document.getElementById('change-settings-shortcut'),
    clearOption: document.getElementById('clear-option'),
    feedPermission: document.getElementById('feed-permission-container'),
    feedPermissionBtn: document.getElementById('feed-permission'),
    feedPermissionRevoke: document.getElementById('feed-permission-revoke-container'),
    feedPermissionRevokeBtn: document.getElementById('feed-permission-revoke'),
    focusOption: document.getElementById('focus-option'),
    focusWebsite: document.getElementById('focus-website'),
    homepageOption: document.getElementById('homepage-option'),
    localFile: document.getElementById('local-file'),
    localFileDeleteLink: document.getElementById('delete-local-file'),
    localFileOption: document.getElementById('local-file-option'),
    tabPosition: document.getElementById('tab-position'),
    type: document.getElementById('type'),
    url: document.getElementById('url'),
    urlOption: document.getElementById('url-option'),
    urlWrapper: document.getElementById('url-wrapper')
  };

  /**
   * Register listeners and initialize the options page.
   *
   * @returns {void}
   */
  static bootstrap () {
    document.addEventListener('DOMContentLoaded', Options.#load);

    PermissionHelper.setupListeners({
      permission: Utils.feedPermission,
      elGrantPermissionContainer: Options.#elements.feedPermission,
      elRevokePermissionContainer: Options.#elements.feedPermissionRevoke,
      elGrantBtn: Options.#elements.feedPermissionBtn,
      elRevokeBtn: Options.#elements.feedPermissionRevokeBtn
    });

    Options.#elements.focusWebsite.addEventListener('change', Options.#handleFocusWebsiteChange);
    Options.#elements.type.addEventListener('change', Options.#handleTypeChange);
    Options.#elements.tabPosition.addEventListener('change', Options.#handleTabPositionChange);
    Options.#elements.url.addEventListener('input', Options.#handleUrlInput);
    Options.#elements.backgroundColor.addEventListener('input', Options.#handleBackgroundColorInput);
    Options.#elements.localFile.addEventListener('change', Options.#handleLocalFileChange);
    Options.#elements.localFileDeleteLink.addEventListener('click', Options.#handleLocalFileDeleteClick);
    Options.#elements.changeSettingsShortcut.addEventListener('click', Options.#handleChangeSettingsShortcutClick);

    browser.runtime.getBrowserInfo().then(Options.#init).catch();
  }

  /**
   * This method will be fired on add-on init.
   *
   * @param {object} info - an object containing information about the browser
   * @returns {void}
   */
  static #init (info) {
    Options.#changeSettingsShortcutButton = Utils.parseVersion(info.version).major >= Options.#firefox137;
  }

  /**
   * This method handles the visibility of the subsections of some options.
   *
   * @returns {void}
   */
  static async #toggleOptionsDetails () {
    let showUrlOption = false;
    let showHomepageOption = false;
    let showFocusOption = false;
    let showClearOption = false;
    let showBackgroundColorOption = false;
    let showLocalFileOption = false;
    let showLocalFileDeleteLink = false;

    if (Options.#elements.type.options[Options.#elements.type.selectedIndex].value === 'homepage') {
      showHomepageOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    if (Options.#elements.type.options[Options.#elements.type.selectedIndex].value === 'custom_url') {
      showUrlOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    if (Options.#elements.type.options[Options.#elements.type.selectedIndex].value === 'local_file') {
      showLocalFileOption = true;
      showFocusOption = true;
      showClearOption = true;

      const { local_file } = await browser.storage.local.get({ local_file: Defaults.values.local_file });
      if (local_file) {
        showLocalFileDeleteLink = true;
      }
    }

    if (Options.#elements.type.options[Options.#elements.type.selectedIndex].value === 'background_color') {
      showBackgroundColorOption = true;
      showFocusOption = false;
      showClearOption = true;
    }

    if (Options.#elements.type.options[Options.#elements.type.selectedIndex].value === 'feed') {
      showFocusOption = true;
      showClearOption = true;
    }

    Options.#toggleVisibility(Options.#elements.urlOption, showUrlOption);
    Options.#toggleVisibility(Options.#elements.homepageOption, showHomepageOption);
    Options.#toggleVisibility(Options.#elements.focusOption, showFocusOption);
    Options.#toggleVisibility(Options.#elements.clearOption, showClearOption);
    Options.#toggleVisibility(Options.#elements.backgroundColorOption, showBackgroundColorOption);
    Options.#toggleVisibility(Options.#elements.localFileOption, showLocalFileOption);
    Options.#toggleVisibility(Options.#elements.localFileDeleteLink, showLocalFileDeleteLink);
    Options.#toggleVisibility(Options.#elements.changeSettingsShortcutWrapper, Options.#changeSettingsShortcutButton);
  }

  /**
   * This method is used to make an DOM element either visible or invisible based on a given condition.
   *
   * @param {HTMLElement} el - the DOM element which should be visible or hidden
   * @param {boolean} condition - whether the element should be visible or hidden
   *
   * @returns {void}
   */
  static #toggleVisibility (el, condition) {
    condition ? el.classList.remove('hidden') : el.classList.add('hidden');
  }

  /**
   * Fired when the initial HTML document has been completely loaded and parsed. This method is used to load the
   * current options.
   *
   * @returns {void}
   */
  static async #load () {
    const option = await browser.storage.local.get(Defaults.values);
    const tabPosition = await browser.browserSettings.newTabPosition.get({});

    Options.#elements.focusWebsite.checked = option.focus_website;
    Options.#elements.type.querySelector('[value="' + option.type + '"]').selected = true;
    Options.#elements.tabPosition.querySelector('[value="' + tabPosition.value + '"]').selected = true;
    Options.#elements.url.value = option.url;
    Options.#elements.backgroundColor.value = option.background_color;
    Options.#toggleOptionsDetails();

    if (option.type === 'feed') {
      PermissionHelper.testPermission(
        Utils.feedPermission,
        Options.#elements.feedPermission,
        Options.#elements.feedPermissionRevoke
      );
    }

    if (Options.#elements.url.value === '') {
      Options.#elements.url.classList.add('error');
      Options.#elements.urlWrapper.querySelector('.error-message.default').classList.remove('hidden');
    }
  }

  /**
   * Persist the focus setting when the user toggles it.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleFocusWebsiteChange (e) {
    browser.storage.local.set({ focus_website: e.target.checked });
  }

  /**
   * Persist the selected type and update the related UI.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleTypeChange (e) {
    if (e.target.value === 'feed') {
      PermissionHelper.testPermission(
        Utils.feedPermission,
        Options.#elements.feedPermission,
        Options.#elements.feedPermissionRevoke
      );
    }
    else {
      Options.#elements.feedPermission.classList.add('hidden');
      Options.#elements.feedPermissionRevoke.classList.add('hidden');
    }

    browser.storage.local.set({ type: e.target.value });
    Options.#toggleOptionsDetails();
  }

  /**
   * Persist the selected tab position.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleTabPositionChange (e) {
    browser.browserSettings.newTabPosition.set({ value: e.target.value });
  }

  /**
   * Validate and persist the custom URL setting.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleUrlInput (e) {
    let url = e.target.value.trim();

    // valid URL
    if (Utils.uriRegex.test(url)) {
      Options.#elements.urlWrapper.querySelector('.error-message').classList.add('hidden');
      Options.#elements.url.classList.remove('error');
    }
    // local file access is not allowed for WebExtensions
    else if (url.startsWith('file://')) {
      Options.#elements.urlWrapper.querySelector('.error-message.default').classList.add('hidden');
      Options.#elements.urlWrapper.querySelector('.error-message.file').classList.remove('hidden');
      Options.#elements.url.classList.add('error');
    }
    // unsupported protocol or empty URL
    else if (Utils.protocolRegex.test(url) || url === '') {
      Options.#elements.urlWrapper.querySelector('.error-message.default').classList.remove('hidden');
      Options.#elements.urlWrapper.querySelector('.error-message.file').classList.add('hidden');
      Options.#elements.url.classList.add('error');
    }
    // prepend https:// for every other input
    else {
      url = 'https://' + url;
    }

    browser.storage.local.set({ url });
  }

  /**
   * Persist the selected background color.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleBackgroundColorInput (e) {
    browser.storage.local.set({ background_color: e.target.value });
  }

  /**
   * Store the selected local file content.
   *
   * @returns {void}
   */
  static #handleLocalFileChange () {
    const reader = new FileReader();

    reader.readAsText(Options.#elements.localFile.files[0]);
    reader.addEventListener('loadend', async () => {
      const file = reader.result;

      await browser.storage.local.set({ local_file: file });
      Options.#toggleVisibility(Options.#elements.localFileDeleteLink, true);
    });
  }

  /**
   * Delete the stored local file content after confirmation.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleLocalFileDeleteClick (e) {
    e.preventDefault();

    // eslint-disable-next-line no-alert
    if (!confirm(e.target.getAttribute('data-confirm'))) {
      return;
    }

    browser.storage.local.set({ local_file: '' });
    Options.#toggleVisibility(Options.#elements.localFileDeleteLink, false);
  }

  /**
   * Open Firefox's shortcut settings UI.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleChangeSettingsShortcutClick (e) {
    e.preventDefault();
    browser.commands.openShortcutSettings();
  }
}

Options.bootstrap();
