'use strict';

/* global Defaults, PermissionHelper, Settings, Utils */

const DIALOG_CLOSE_ANIMATION_DURATION_IN_MS = 260;

class OptionsPage {
  /**
   * DOM elements used throughout the option page
   *
   * @type {object}
   */
  static #$elements = {
    $backgroundColor: document.getElementById('background-color'),
    $backgroundColorOption: document.getElementById('background-color-option'),
    $backgroundColorValue: document.getElementById('background-color-value'),
    $backgroundColorWrapper: document.getElementById('background-color-wrapper'),
    $clearOption: document.getElementById('clear-option'),
    $contextRuleContainer: document.getElementById('context-rule-container'),
    $contextRuleContainerField: document.getElementById('context-rule-container-field'),
    $contextRuleContainerLabel: document.getElementById('context-rule-container-label'),
    $contextRuleEditor: document.getElementById('context-rule-editor'),
    $contextRuleGroup: document.getElementById('context-rule-group'),
    $contextRuleGroupLabel: document.getElementById('context-rule-group-label'),
    $contextRules: document.getElementById('context-rules'),
    $contextRulesListManagedBadge: document.getElementById('context-rules-list-managed-badge'),
    $contextRulesManagedBadge: document.getElementById('context-rules-managed-badge'),
    $contextRulesOption: document.getElementById('context-rules-option'),
    $contextRuleSave: document.getElementById('context-rule-save'),
    $contextRuleScope: document.getElementById('context-rule-scope'),
    $contextRuleUrl: document.getElementById('context-rule-url'),
    $contextRuleUrlValidationDefault: document.querySelector('#context-rule-url-wrapper .error-message.default'),
    $contextRuleUrlValidationFile: document.querySelector('#context-rule-url-wrapper .error-message.file'),
    $deleteContextRuleCancelButton: document.getElementById('delete-context-rule-cancel'),
    $deleteContextRuleConfirmButton: document.getElementById('delete-context-rule-confirm'),
    $deleteContextRuleDialog: document.getElementById('delete-context-rule-dialog'),
    $deleteContextRuleDialogText: document.getElementById('delete-context-rule-dialog-text'),
    $deleteLocalFileCancelButton: document.getElementById('delete-local-file-cancel'),
    $deleteLocalFileConfirmButton: document.getElementById('delete-local-file-confirm'),
    $deleteLocalFileDialog: document.getElementById('delete-local-file-dialog'),
    $feedPermission: document.getElementById('feed-permission-container'),
    $feedPermissionBtn: document.getElementById('feed-permission'),
    $feedPermissionRevoke: document.getElementById('feed-permission-revoke-container'),
    $feedPermissionRevokeBtn: document.getElementById('feed-permission-revoke'),
    $focusOption: document.getElementById('focus-option'),
    $focusWebsite: document.getElementById('focus-website'),
    $homepageOption: document.getElementById('homepage-option'),
    $localFile: document.getElementById('local-file'),
    $localFileDeleteButton: document.getElementById('delete-local-file'),
    $localFileOption: document.getElementById('local-file-option'),
    $managedNotice: document.getElementById('managed-options-notice'),
    $tabPosition: document.getElementById('tab-position'),
    $type: document.getElementById('type')
  };

  /**
   * Context-specific URL rules currently stored by the extension
   *
   * @type {{containers: object, groups: object}}
   */
  static #contextRules = { containers: {}, groups: {} };

  /**
   * Standard URL used by the custom URL option when no tab group or container rule matches
   *
   * @type {string}
   */
  static #defaultUrl = '';

  /**
   * Whether the standard URL is controlled by an enterprise policy
   *
   * @type {boolean}
   */
  static #defaultUrlManaged = false;

  /**
   * Whether context-specific URL rules are read-only because of enterprise policies
   *
   * @type {boolean}
   */
  static #contextRulesReadOnly = false;

  /**
   * Available Firefox tab environments, indexed by their cookie store ID
   *
   * @type {Map<string, {color: string, colorCode: string, iconUrl: string, name: string}>}
   */
  static #containers = new Map();

  /**
   * Unambiguous colors of currently open named tab groups
   *
   * @type {Map<string, string|null>}
   */
  static #groupColors = new Map();

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

    OptionsPage.#$elements.$deleteLocalFileDialog.addEventListener('cancel', e => {
      e.preventDefault();
      void OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteLocalFileDialog);
    });
    OptionsPage.#$elements.$deleteLocalFileDialog.addEventListener('close', () => {
      OptionsPage.#$elements.$deleteLocalFileDialog.classList.remove('closing');
    });
    OptionsPage.#$elements.$deleteLocalFileCancelButton.addEventListener('click', () => {
      void OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteLocalFileDialog);
    });
    OptionsPage.#$elements.$deleteLocalFileConfirmButton.addEventListener('click', () => {
      void OptionsPage.#handleLocalFileDeleteConfirmClick();
    });
    OptionsPage.#$elements.$deleteContextRuleDialog.addEventListener('cancel', e => {
      e.preventDefault();
      void OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteContextRuleDialog);
    });
    OptionsPage.#$elements.$deleteContextRuleDialog.addEventListener('close', () => {
      OptionsPage.#$elements.$deleteContextRuleDialog.classList.remove('closing');
      delete OptionsPage.#$elements.$deleteContextRuleDialog.dataset.ruleScope;
      delete OptionsPage.#$elements.$deleteContextRuleDialog.dataset.ruleIdentifier;
      OptionsPage.#$elements.$deleteContextRuleDialogText.textContent = '';
    });
    OptionsPage.#$elements.$deleteContextRuleCancelButton.addEventListener('click', () => {
      void OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteContextRuleDialog);
    });
    OptionsPage.#$elements.$deleteContextRuleConfirmButton.addEventListener('click', () => {
      void OptionsPage.#handleContextRuleDeleteConfirmClick();
    });
    OptionsPage.#$elements.$contextRuleSave.addEventListener('click', () => {
      OptionsPage.#handleContextRuleSaveClick();
    });
    OptionsPage.#$elements.$contextRuleContainer.addEventListener('change', OptionsPage.#updateContextRuleEditor);
    OptionsPage.#$elements.$contextRuleScope.addEventListener('change', OptionsPage.#updateContextRuleEditor);
    OptionsPage.#$elements.$contextRules.addEventListener('click', e => {
      OptionsPage.#handleContextRuleDeleteClick(e);
    });
    OptionsPage.#$elements.$contextRuleUrl.addEventListener('input', e => {
      OptionsPage.#validateUrl(
        e.target.value,
        e.target,
        OptionsPage.#$elements.$contextRuleUrlValidationDefault,
        OptionsPage.#$elements.$contextRuleUrlValidationFile
      );
    });
    OptionsPage.#$elements.$contextRuleUrl.addEventListener('keydown', e => {
      if (e.key !== 'Enter') {
        return;
      }

      e.preventDefault();
      OptionsPage.#handleContextRuleSaveClick();
    });
    OptionsPage.#$elements.$focusWebsite.addEventListener('change', OptionsPage.#handleFocusWebsiteChange);
    OptionsPage.#$elements.$type.addEventListener('change', OptionsPage.#handleTypeChange);
    OptionsPage.#$elements.$tabPosition.addEventListener('change', OptionsPage.#handleTabPositionChange);
    OptionsPage.#$elements.$backgroundColor.addEventListener('input', OptionsPage.#handleBackgroundColorInput);
    OptionsPage.#$elements.$localFile.addEventListener('change', OptionsPage.#handleLocalFileChange);
    OptionsPage.#$elements.$localFileDeleteButton.addEventListener('click', OptionsPage.#handleLocalFileDeleteClick);
  }

  /**
   * This method handles the visibility of the subsections of some options.
   *
   * @returns {Promise<void>}
   */
  static async #toggleOptionsDetails () {
    let showHomepageOption = false;
    let showFocusOption = false;
    let showClearOption = false;
    let showBackgroundColorOption = false;
    let showLocalFileOption = false;
    let showLocalFileDeleteButton = false;
    let showContextRulesOption = false;

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'homepage') {
      showHomepageOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'custom_url') {
      showContextRulesOption = true;
      showFocusOption = true;
      showClearOption = true;
    }

    if (OptionsPage.#$elements.$type.options[OptionsPage.#$elements.$type.selectedIndex].value === 'local_file') {
      showLocalFileOption = true;
      showFocusOption = true;
      showClearOption = true;

      const { local_file } = await browser.storage.local.get({ local_file: Defaults.values.local_file });
      if (local_file) {
        showLocalFileDeleteButton = true;
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

    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$homepageOption, showHomepageOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$focusOption, showFocusOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$clearOption, showClearOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$backgroundColorOption, showBackgroundColorOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileOption, showLocalFileOption);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileDeleteButton, showLocalFileDeleteButton);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$contextRulesOption, showContextRulesOption);
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
   * Close a dialog after the CSS exit transition has finished.
   *
   * @param {HTMLDialogElement} $dialog - the dialog to close
   *
   * @returns {Promise<void>}
   */
  static #closeDialog ($dialog) {
    if (!$dialog.open) {
      return Promise.resolve();
    }

    if ($dialog.classList.contains('closing')) {
      return new Promise(resolve => {
        $dialog.addEventListener('close', resolve, { once: true });
      });
    }

    $dialog.classList.add('closing');

    return new Promise(resolve => {
      let didClose = false;
      const close = () => {
        if (didClose) {
          return;
        }

        didClose = true;
        $dialog.close();
      };

      const onTransitionEnd = e => {
        if (e.target === $dialog && e.propertyName === 'opacity') {
          close();
        }
      };

      window.setTimeout(close, DIALOG_CLOSE_ANIMATION_DURATION_IN_MS);
      $dialog.addEventListener('close', () => {
        $dialog.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      }, { once: true });
      $dialog.addEventListener('transitionend', onTransitionEnd);
    });
  }

  /**
   * Fired when the initial HTML document has been completely loaded and parsed. This method is used to load the
   * current options.
   *
   * @returns {Promise<void>}
   */
  static async #load () {
    const [localSettings, managedSettings, tabPosition, containers, tabGroups] = await Promise.all([
      browser.storage.local.get(Defaults.values),
      Settings.getManaged(),
      browser.browserSettings.newTabPosition.get({}),
      browser.contextualIdentities.query({}).catch(() => []),
      browser.tabGroups.query({}).catch(() => [])
    ]);
    const option = { ...localSettings, ...managedSettings };
    const managedKeySet = new Set(Object.keys(managedSettings));
    const url = option.url.trim();
    const contextRules = option.context_rules;

    OptionsPage.#contextRules = {
      containers: contextRules?.containers && typeof contextRules.containers === 'object' &&
        !Array.isArray(contextRules.containers) ? contextRules.containers : {},
      groups: contextRules?.groups && typeof contextRules.groups === 'object' &&
        !Array.isArray(contextRules.groups) ? contextRules.groups : {}
    };
    OptionsPage.#defaultUrl = url;
    OptionsPage.#defaultUrlManaged = managedKeySet.has('url');
    OptionsPage.#contextRulesReadOnly = managedKeySet.has('context_rules') || managedKeySet.has('type') ||
      managedKeySet.has('url');

    OptionsPage.#$elements.$focusWebsite.checked = option.focus_website;
    OptionsPage.#$elements.$type.querySelector('[value="' + option.type + '"]').selected = true;
    OptionsPage.#$elements.$tabPosition.querySelector('[value="' + tabPosition.value + '"]').selected = true;
    OptionsPage.#$elements.$backgroundColor.value = option.background_color;
    OptionsPage.#updateBackgroundColorPreview(option.background_color);
    OptionsPage.#$elements.$type.disabled = managedKeySet.has('type');
    OptionsPage.#$elements.$focusWebsite.disabled = managedKeySet.has('focus_website');
    OptionsPage.#$elements.$backgroundColor.disabled = managedKeySet.has('background_color');
    OptionsPage.#$elements.$contextRulesOption.classList.toggle(
      'managed-option',
      OptionsPage.#defaultUrlManaged || OptionsPage.#contextRulesReadOnly
    );
    OptionsPage.#toggleVisibility(
      OptionsPage.#$elements.$contextRulesManagedBadge,
      OptionsPage.#defaultUrlManaged || OptionsPage.#contextRulesReadOnly
    );
    OptionsPage.#toggleVisibility(
      OptionsPage.#$elements.$contextRulesListManagedBadge,
      managedKeySet.has('context_rules')
    );
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$managedNotice, managedKeySet.size > 0);

    for (const $managedOption of document.querySelectorAll('[data-managed-key]')) {
      const isManaged = managedKeySet.has($managedOption.getAttribute('data-managed-key'));

      $managedOption.classList.toggle('managed-option', isManaged);
      OptionsPage.#toggleVisibility($managedOption.querySelector('.managed-badge'), isManaged);
    }

    await OptionsPage.#toggleOptionsDetails();
    OptionsPage.#loadContextRuleTargets(containers, tabGroups);
    OptionsPage.#renderContextRules();

    if (option.type === 'feed') {
      await PermissionHelper.testPermission(
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
    void browser.storage.local.set({ focus_website: e.target.checked });
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
      void PermissionHelper.testPermission(
        Utils.feedPermission,
        OptionsPage.#$elements.$feedPermission,
        OptionsPage.#$elements.$feedPermissionRevoke
      );
    }
    else {
      OptionsPage.#$elements.$feedPermission.classList.add('hidden');
      OptionsPage.#$elements.$feedPermissionRevoke.classList.add('hidden');
    }

    void browser.storage.local.set({ type: e.target.value });
    void OptionsPage.#toggleOptionsDetails();
  }

  /**
   * Persist the selected tab position.
   *
   * @param {Event} e - event
   *
   * @returns {void}
   */
  static #handleTabPositionChange (e) {
    void browser.browserSettings.newTabPosition.set({ value: e.target.value });
  }

  /**
   * Validate a URL and update the inline validation state of its input field.
   *
   * @param {string} input - URL entered by the user
   * @param {HTMLInputElement} $input - input element to update
   * @param {HTMLElement} $defaultError - validation badge for unsupported or empty URLs
   * @param {HTMLElement} $fileError - validation badge for local file URLs
   * @param {boolean} allowEmpty - whether an empty value is valid
   *
   * @returns {string|null} - sanitized URL, or null if the value is invalid
   */
  static #validateUrl (input, $input, $defaultError, $fileError, allowEmpty = false) {
    let url = input.trim();
    let isValid = true;
    let isFileUrl = false;

    if (url === '' && allowEmpty) {
      OptionsPage.#toggleVisibility($defaultError, false);
      OptionsPage.#toggleVisibility($fileError, false);
      $input.classList.remove('error');

      return url;
    }

    if (!Utils.uriRegex.test(url)) {
      if (url.startsWith('file://')) {
        isValid = false;
        isFileUrl = true;
      }
      else if (Utils.protocolRegex.test(url) || url === '') {
        isValid = false;
      }
      else {
        url = 'https://' + url;
      }
    }

    OptionsPage.#toggleVisibility($defaultError, !isValid && !isFileUrl);
    OptionsPage.#toggleVisibility($fileError, isFileUrl);
    $input.classList.toggle('error', !isValid);

    return isValid ? url : null;
  }

  /**
   * Populate the Firefox tab environments and tab group colors used by the rule editor.
   *
   * @param {contextualIdentities.ContextualIdentity[]} containers - available Firefox tab environments
   * @param {tabGroups.TabGroup[]} tabGroups - currently open Firefox tab groups
   *
   * @returns {void}
   */
  static #loadContextRuleTargets (containers, tabGroups) {
    const scopes = [
      { message: 'context_rules_scope_default', value: 'default' },
      { message: 'context_rules_scope_container', value: 'containers' },
      { message: 'context_rules_scope_group', value: 'groups' }
    ];

    for (const scope of scopes) {
      const $option = document.createElement('option');

      $option.value = scope.value;
      $option.textContent = browser.i18n.getMessage(scope.message);
      OptionsPage.#$elements.$contextRuleScope.appendChild($option);
    }

    OptionsPage.#containers.clear();
    OptionsPage.#$elements.$contextRuleContainer.textContent = '';

    containers.sort((a, b) => a.name.localeCompare(b.name));

    for (const container of containers) {
      const $option = document.createElement('option');

      $option.value = container.cookieStoreId;
      $option.textContent = container.name;
      OptionsPage.#$elements.$contextRuleContainer.appendChild($option);
      OptionsPage.#containers.set(container.cookieStoreId, {
        color: container.color,
        colorCode: container.colorCode,
        iconUrl: container.iconUrl,
        name: container.name
      });
    }

    if (OptionsPage.#$elements.$contextRuleContainer.options.length === 0) {
      const $option = document.createElement('option');

      $option.textContent = browser.i18n.getMessage('context_rules_container_none');
      $option.disabled = true;
      OptionsPage.#$elements.$contextRuleContainer.appendChild($option);
    }

    OptionsPage.#groupColors.clear();

    for (const group of tabGroups) {
      if (group.title) {
        if (!OptionsPage.#groupColors.has(group.title)) {
          OptionsPage.#groupColors.set(group.title, group.color);
        }
        else if (OptionsPage.#groupColors.get(group.title) !== group.color) {
          OptionsPage.#groupColors.set(group.title, null);
        }
      }
    }

    OptionsPage.#updateContextRuleEditor();
  }

  /**
   * Update the visible target field and available actions for the selected rule scope.
   *
   * @returns {void}
   */
  static #updateContextRuleEditor () {
    const scope = OptionsPage.#$elements.$contextRuleScope.value;
    const isDefaultRule = scope === 'default';
    const isContainerRule = scope === 'containers';
    const isGroupRule = scope === 'groups';
    const isReadOnly = isDefaultRule ? OptionsPage.#defaultUrlManaged : OptionsPage.#contextRulesReadOnly;
    let url = '';

    if (isDefaultRule) {
      url = OptionsPage.#defaultUrl;
    }
    else if (isContainerRule) {
      url = OptionsPage.#contextRules.containers[OptionsPage.#$elements.$contextRuleContainer.value] || '';
    }

    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$contextRuleContainerLabel, isContainerRule);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$contextRuleContainerField, isContainerRule);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$contextRuleGroupLabel, isGroupRule);
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$contextRuleGroup, isGroupRule);
    OptionsPage.#$elements.$contextRuleEditor.classList.toggle('default-rule', isDefaultRule);
    OptionsPage.#$elements.$contextRuleUrl.value = url;
    OptionsPage.#$elements.$contextRuleScope.disabled = OptionsPage.#contextRulesReadOnly;
    OptionsPage.#$elements.$contextRuleContainer.disabled = OptionsPage.#contextRulesReadOnly;
    OptionsPage.#$elements.$contextRuleGroup.disabled = OptionsPage.#contextRulesReadOnly;
    OptionsPage.#$elements.$contextRuleUrl.disabled = isReadOnly;

    if (isDefaultRule) {
      OptionsPage.#validateUrl(
        OptionsPage.#$elements.$contextRuleUrl.value,
        OptionsPage.#$elements.$contextRuleUrl,
        OptionsPage.#$elements.$contextRuleUrlValidationDefault,
        OptionsPage.#$elements.$contextRuleUrlValidationFile,
        true
      );
    }
    else {
      OptionsPage.#$elements.$contextRuleUrl.classList.remove('error');
      OptionsPage.#$elements.$contextRuleUrlValidationDefault.classList.add('hidden');
      OptionsPage.#$elements.$contextRuleUrlValidationFile.classList.add('hidden');
    }
    OptionsPage.#$elements.$contextRuleSave.disabled = isReadOnly || (isContainerRule &&
      OptionsPage.#$elements.$contextRuleContainer.value === '');
  }

  /**
   * Save or replace a URL rule.
   *
   * @returns {void}
   */
  static #handleContextRuleSaveClick () {
    const scope = OptionsPage.#$elements.$contextRuleScope.value;
    const url = OptionsPage.#validateUrl(
      OptionsPage.#$elements.$contextRuleUrl.value,
      OptionsPage.#$elements.$contextRuleUrl,
      OptionsPage.#$elements.$contextRuleUrlValidationDefault,
      OptionsPage.#$elements.$contextRuleUrlValidationFile,
      scope === 'default'
    );

    if (url === null) {
      OptionsPage.#$elements.$contextRuleUrl.focus();

      return;
    }

    if (scope === 'default') {
      OptionsPage.#defaultUrl = url;
      OptionsPage.#$elements.$contextRuleUrl.value = url;
      void browser.storage.local.set({ url });
      OptionsPage.#renderContextRules();

      return;
    }

    let $target = OptionsPage.#$elements.$contextRuleGroup;

    if (scope === 'containers') {
      $target = OptionsPage.#$elements.$contextRuleContainer;
    }

    const identifier = $target.value.trim();

    if (!identifier) {
      $target.focus();

      return;
    }

    const rulesForScope = Object.fromEntries([
      ...Object.entries(OptionsPage.#contextRules[scope]),
      [identifier, url]
    ]);

    OptionsPage.#contextRules = {
      containers: { ...OptionsPage.#contextRules.containers },
      groups: { ...OptionsPage.#contextRules.groups },
      [scope]: rulesForScope
    };

    void browser.storage.local.set({ context_rules: OptionsPage.#contextRules });

    if (scope === 'groups') {
      OptionsPage.#$elements.$contextRuleGroup.value = '';
    }

    OptionsPage.#updateContextRuleEditor();
    OptionsPage.#renderContextRules();
  }

  /**
   * Remove a context-specific URL rule selected from the rule list.
   *
   * @param {Event} e - click event from the rule list
   *
   * @returns {void}
   */
  static #handleContextRuleDeleteClick (e) {
    const $button = e.target.closest('button[data-rule-scope]');

    if (!$button) {
      return;
    }

    OptionsPage.#$elements.$deleteContextRuleDialog.dataset.ruleScope = $button.dataset.ruleScope;
    OptionsPage.#$elements.$deleteContextRuleDialog.dataset.ruleIdentifier = $button.dataset.ruleIdentifier;
    const placeholder = '__RULE_LABEL__';
    const [messageStart, messageEnd] = browser.i18n.getMessage(
      'context_rules_delete_confirmation',
      [placeholder]
    ).split(placeholder);
    const $ruleLabel = document.createElement('strong');

    $ruleLabel.textContent = $button.dataset.ruleLabel;
    OptionsPage.#$elements.$deleteContextRuleDialogText.replaceChildren(messageStart, $ruleLabel, messageEnd);
    OptionsPage.#$elements.$deleteContextRuleDialog.showModal();
  }

  /**
   * Remove the selected context-specific URL rule after confirmation.
   *
   * @returns {Promise<void>}
   */
  static async #handleContextRuleDeleteConfirmClick () {
    const { ruleScope, ruleIdentifier } = OptionsPage.#$elements.$deleteContextRuleDialog.dataset;

    if (ruleScope === 'default') {
      OptionsPage.#defaultUrl = '';
      await browser.storage.local.set({ url: '' });
      OptionsPage.#updateContextRuleEditor();
      OptionsPage.#renderContextRules();
      await OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteContextRuleDialog);

      return;
    }

    const rulesForScope = { ...OptionsPage.#contextRules[ruleScope] };

    delete rulesForScope[ruleIdentifier];
    OptionsPage.#contextRules = {
      ...OptionsPage.#contextRules,
      [ruleScope]: rulesForScope
    };

    await browser.storage.local.set({ context_rules: OptionsPage.#contextRules });

    if (ruleScope === 'containers' && OptionsPage.#$elements.$contextRuleScope.value === ruleScope &&
      OptionsPage.#$elements.$contextRuleContainer.value === ruleIdentifier) {
      OptionsPage.#updateContextRuleEditor();
    }

    OptionsPage.#renderContextRules();
    await OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteContextRuleDialog);
  }

  /**
   * Render the standard URL first, followed by context-specific URL rules in precedence order.
   *
   * @returns {void}
   */
  static #renderContextRules () {
    const rules = [
      {
        identifier: '',
        label: browser.i18n.getMessage('context_rules_scope_default'),
        priority: 0,
        scope: 'default',
        url: OptionsPage.#defaultUrl
      }
    ];

    for (const [identifier, url] of Object.entries(OptionsPage.#contextRules.containers)) {
      const container = OptionsPage.#containers.get(identifier);

      rules.push({
        color: container?.color === 'toolbar' ? 'var(--color-page-text)' : container?.colorCode || '',
        identifier,
        icon: container?.iconUrl || '',
        label: container?.name || identifier,
        priority: 2,
        scope: 'containers',
        url
      });
    }

    for (const [identifier, url] of Object.entries(OptionsPage.#contextRules.groups)) {
      rules.push({
        color: OptionsPage.#groupColors.get(identifier) || '',
        identifier,
        label: identifier,
        priority: 1,
        scope: 'groups',
        url
      });
    }

    rules.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label));
    OptionsPage.#$elements.$contextRules.textContent = '';

    const $fragment = document.createDocumentFragment();
    const $lists = new Map();

    for (const rule of rules) {
      const $listItem = document.createElement('li');
      const $description = document.createElement('div');
      const $heading = document.createElement('div');
      const $name = document.createElement('strong');
      const $url = document.createElement('span');
      let scopeLabel = browser.i18n.getMessage('context_rules_scope_default');

      if (!$lists.has(rule.scope)) {
        const $list = document.createElement('ul');

        $list.className = 'context-rules-list';
        $lists.set(rule.scope, $list);

        if (rule.scope === 'default') {
          $fragment.appendChild($list);
        }
        else {
          const $section = document.createElement('section');
          const $sectionTitle = document.createElement('h5');
          let titleMessage = 'context_rules_list_containers';

          if (rule.scope === 'groups') {
            titleMessage = 'context_rules_list_groups';
          }

          $section.className = 'context-rules-section';
          $sectionTitle.className = 'context-rules-section-title';
          $sectionTitle.textContent = browser.i18n.getMessage(titleMessage);
          $section.append($sectionTitle, $list);
          $fragment.appendChild($section);
        }
      }

      if (rule.scope === 'containers') {
        scopeLabel = browser.i18n.getMessage('context_rules_scope_container');
      }
      else if (rule.scope === 'groups') {
        scopeLabel = browser.i18n.getMessage('context_rules_scope_group');
      }

      $listItem.className = 'context-rule';
      $description.className = 'context-rule-description';
      $heading.className = 'context-rule-heading';
      $name.className = 'context-rule-name';
      $name.textContent = rule.scope === 'default' ? scopeLabel : rule.label;

      $url.textContent = rule.url || browser.i18n.getMessage('context_rules_default_empty');

      if (rule.scope === 'default') {
        $listItem.classList.add('default-rule');
        $heading.appendChild($name);
      }
      else {
        const $indicator = document.createElement('span');

        $indicator.className = 'context-rule-indicator context-rule-color';
        $indicator.setAttribute('aria-hidden', 'true');

        if (rule.icon) {
          $indicator.className = 'context-rule-indicator context-rule-icon';
          $indicator.style.maskImage = 'url("' + rule.icon + '")';
        }

        if (rule.color) {
          $listItem.classList.add('has-rule-color');

          if (rule.scope === 'groups') {
            $listItem.dataset.ruleColor = rule.color;
          }
          else {
            $listItem.style.setProperty('--context-rule-color', rule.color);
          }
        }

        $heading.append($indicator, $name);
      }

      $description.append($heading, $url);
      $listItem.appendChild($description);

      if (rule.scope !== 'default' || rule.url) {
        const $deleteButton = document.createElement('button');

        $deleteButton.type = 'button';
        $deleteButton.className = 'context-rule-delete';
        $deleteButton.dataset.ruleLabel = rule.scope === 'default' ? scopeLabel : scopeLabel + ': ' + rule.label;
        $deleteButton.dataset.ruleScope = rule.scope;
        $deleteButton.dataset.ruleIdentifier = rule.identifier;
        $deleteButton.textContent = browser.i18n.getMessage('context_rules_delete');
        $deleteButton.disabled = rule.scope === 'default' ? OptionsPage.#defaultUrlManaged : OptionsPage.#contextRulesReadOnly;
        $listItem.appendChild($deleteButton);
      }

      $lists.get(rule.scope).appendChild($listItem);
    }

    OptionsPage.#$elements.$contextRules.appendChild($fragment);
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
    void browser.storage.local.set({ background_color: e.target.value });
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
      OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileDeleteButton, true);
    });
  }

  /**
   * Delete the stored local file content after confirmation.
   *
   * @returns {void}
   */
  static #handleLocalFileDeleteClick () {
    OptionsPage.#$elements.$deleteLocalFileDialog.showModal();
  }

  /**
   * Delete the stored local file content after confirmation.
   *
   * @returns {Promise<void>}
   */
  static async #handleLocalFileDeleteConfirmClick () {
    await browser.storage.local.set({ local_file: '' });
    OptionsPage.#$elements.$localFile.value = '';
    OptionsPage.#toggleVisibility(OptionsPage.#$elements.$localFileDeleteButton, false);
    await OptionsPage.#closeDialog(OptionsPage.#$elements.$deleteLocalFileDialog);
  }
}

OptionsPage.bootstrap();
