'use strict';

/* global Defaults, PermissionHelper, Settings, Utils */

class OptionsPage {
  static #$elements = {
    $backgroundColor: document.getElementById('background-color'),
    $backgroundColorOption: document.getElementById('background-color-option'),
    $backgroundColorValue: document.getElementById('background-color-value'),
    $backgroundColorWrapper: document.getElementById('background-color-wrapper'),
    $changeSettingsShortcut: document.getElementById('change-settings-shortcut'),
    $clearOption: document.getElementById('clear-option'),
    $feedPermission: document.getElementById('feed-permission-container'),
    $feedPermissionBtn: document.getElementById('feed-permission'),
    $feedPermissionRevoke: document.getElementById('feed-permission-revoke-container'),
    $feedPermissionRevokeBtn: document.getElementById('feed-permission-revoke'),
    $focusOption: document.getElementById('focus-option'),
    $focusWebsite: document.getElementById('focus-website'),
    $homepageOption: document.getElementById('homepage-option'),
    $localFile: document.getElementById('local-file'),
    $localFileDeleteLink: document.getElementById('delete-local-file'),
    $localFileOption: document.getElementById('local-file-option'),
    $managedNotice: document.getElementById('managed-options-notice'),
    $tabPosition: document.getElementById('tab-position'),
    $type: document.getElementById('type'),
    $url: document.getElementById('url'),
    $urlValidationDefault: document.querySelector('#url-wrapper .error-message.default'),
    $urlValidationFile: document.querySelector('#url-wrapper .error-message.file'),
    $urlOption: document.getElementById('url-option'),
    $urlWrapper: document.getElementById('url-wrapper')
  };

  /**
   * Register listeners and initialize the option page.
   *
   * @returns {void}
   */
  static bootstrap () {
    document.addEventListener('DOMContentLoaded', OptionsPage.#load);

    PermissionHelper.setupListeners({
      permission: Utils.feedPermission,
      $grantPermissionContainer: OptionsPage.#$elements.$feedPermission,
      $revokePermissionContainer: OptionsPage.#$elements.$feedPermissionRevoke,
      $grantBtn: OptionsPage.#$elements.$feedPermissionBtn,
      $revokeBtn: OptionsPage.#$elements.$feedPermissionRevokeBtn
    });

    OptionsPage.#$elements.$focusWebsite.addEventListener('change', OptionsPage.#handleFocusWebsiteChange);
    OptionsPage.#$elements.$type.addEventListener('change', OptionsPage.#handleTypeChange);
    OptionsPage.#$elements.$tabPosition.addEventListener('change', OptionsPage.#handleTabPositionChange);
    OptionsPage.#$elements.$url.addEventListener('input', OptionsPage.#handleUrlInput);
    OptionsPage.#$elements.$backgroundColor.addEventListener('input', OptionsPage.#handleBackgroundColorInput);
    OptionsPage.#$elements.$localFile.addEventListener('change', OptionsPage.#handleLocalFileChange);
    OptionsPage.#$elements.$localFileDeleteLink.addEventListener('click', OptionsPage.#handleLocalFileDeleteClick);
    OptionsPage.#$elements.$changeSettingsShortcut.addEventListener('click', OptionsPage.#handleChangeSettingsShortcutClick);
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

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'homepage') {
      showHomepageOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'custom_url') {
      showUrlOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'local_file') {
      showLocalFileOption = true;
      showFocusOption = true;
      showClearOption = true;

      const { local_file } = await browser.storage.local.get({ local_file: Defaults.values.local_file });
      if (local_file) {
        showLocalFileDeleteLink = true;
      }
    }

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'background_color') {
      showBackgroundColorOption = true;
      showFocusOption = false;
      showClearOption = true;
    }

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'feed') {
      showFocusOption = true;
      showClearOption = true;
    }

    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$urlOption, showUrlOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$homepageOption, showHomepageOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$focusOption, showFocusOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$clearOption, showClearOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$backgroundColorOption, showBackgroundColorOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileOption, showLocalFileOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileDeleteLink, showLocalFileDeleteLink);
  }

  /**
   * This method is used to make a DOM element either visible or invisible based on a given condition.
   *
   * @param {HTMLElement} $el - the DOM element which should be visible or hidden
   * @param {boolean} condition - whether the element should be visible or hidden
   *
   * @returns {void}
   */
  static #toggleVisibility ($el, condition) {
    condition ? $el.classList.remove('hidden') : $el.classList.add('hidden');
  }

  /**
   * Fired when the initial HTML document has been completely loaded and parsed. This method is used to load the
   * current options.
   *
   * @returns {void}
   */
  static async #load () {
    const [localSettings, managedSettings, tabPosition] = await Promise.all([
      browser.storage.local.get(Defaults.values),
      Settings.getManaged(),
      browser.browserSettings.newTabPosition.get({})
    ]);
    const option = { ...localSettings, ...managedSettings };
    const managedKeySet = new Set(Object.keys(managedSettings));
    const url = option.url.trim();

    OptionsPage.#$elements.$focusWebsite.checked = option.focus_website;
    OptionsPage.#$elements.$type.querySelector('[value="' + option.type + '"]').selected = true;
    OptionsPage.#$elements.$tabPosition.querySelector('[value="' + tabPosition.value + '"]').selected = true;
    OptionsPage.#$elements.$url.value = option.url;
    OptionsPage.#$elements.$backgroundColor.value = option.background_color;
    OptionsPage.#updateBackgroundColorPreview(option.background_color);
    OptionsPage.#$elements.$type.disabled = managedKeySet.has('type');
    OptionsPage.#$elements.$url.disabled = managedKeySet.has('url');
    OptionsPage.#$elements.$focusWebsite.disabled = managedKeySet.has('focus_website');
    OptionsPage.#$elements.$backgroundColor.disabled = managedKeySet.has('background_color');
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$managedNotice, managedKeySet.size > 0);

    for (const $managedOption of document.querySelectorAll('[data-managed-key]')) {
      const isManaged = managedKeySet.has($managedOption.getAttribute('data-managed-key'));

      $managedOption.classList.toggle('managed-option', isManaged);
      OptionsPage.#toggleVisibility($managedOption.querySelector('.managed-badge'), isManaged);
    }

    OptionsPage.#toggleOptionsDetails();

    if (Utils.uriRegex.test(url)) {
      OptionsPage.#$elements.$urlValidationDefault.classList.add('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.add('hidden');
      OptionsPage.#$elements.$url.classList.remove('error');
    }
    else if (url.startsWith('file://')) {
      OptionsPage.#$elements.$urlValidationDefault.classList.add('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.remove('hidden');
      OptionsPage.#$elements.$url.classList.add('error');
    }
    else {
      OptionsPage.#$elements.$urlValidationDefault.classList.remove('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.add('hidden');
      OptionsPage.#$elements.$url.classList.add('error');
    }

    if (option.type === 'feed') {
      PermissionHelper.testPermission(
        Utils.feedPermission,
        OptionsPage.#$elements.$feedPermission,
        OptionsPage.#$elements.$feedPermissionRevoke
      );
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
        OptionsPage.#$elements.$feedPermission,
        OptionsPage.#$elements.$feedPermissionRevoke
      );
    }
    else {
      OptionsPage.#$elements.$feedPermission.classList.add('hidden');
      OptionsPage.#$elements.$feedPermissionRevoke.classList.add('hidden');
    }

    browser.storage.local.set({ type: e.target.value });
    OptionsPage.#toggleOptionsDetails();
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
      OptionsPage.#$elements.$urlValidationDefault.classList.add('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.add('hidden');
      OptionsPage.#$elements.$url.classList.remove('error');
    }
    // local file access is not allowed for WebExtensions
    else if (url.startsWith('file://')) {
      OptionsPage.#$elements.$urlValidationDefault.classList.add('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.remove('hidden');
      OptionsPage.#$elements.$url.classList.add('error');
    }
    // unsupported protocol or empty URL
    else if (Utils.protocolRegex.test(url) || url === '') {
      OptionsPage.#$elements.$urlValidationDefault.classList.remove('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.add('hidden');
      OptionsPage.#$elements.$url.classList.add('error');
    }
    // prepend https:// for every other input
    else {
      OptionsPage.#$elements.$urlValidationDefault.classList.add('hidden');
      OptionsPage.#$elements.$urlValidationFile.classList.add('hidden');
      OptionsPage.#$elements.$url.classList.remove('error');
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
    OptionsPage.#updateBackgroundColorPreview(e.target.value);
    browser.storage.local.set({ background_color: e.target.value });
  }

  /**
   * Update the visual color field with the selected hex code and a readable text color.
   *
   * @param {string} hexColor - the selected color
   *
   * @returns {void}
   */
  static #updateBackgroundColorPreview (hexColor) {
    const normalizedHexColor = hexColor.toLowerCase();

    OptionsPage.#$elements.$backgroundColorValue.textContent = normalizedHexColor;
    OptionsPage.#$elements.$backgroundColorWrapper.style.setProperty('--background-color-preview', normalizedHexColor);
  }

  /**
   * Store the selected local file content.
   *
   * @returns {void}
   */
  static #handleLocalFileChange () {
    const reader = new FileReader();

    reader.readAsText(OptionsPage.#$elements.$localFile.files[0]);
    reader.addEventListener('loadend', async () => {
      const file = reader.result;

      await browser.storage.local.set({ local_file: file });
      OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileDeleteLink, true);
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
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileDeleteLink, false);
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

OptionsPage.bootstrap();
