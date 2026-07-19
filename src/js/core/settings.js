'use strict';

/* global Defaults, Utils */

class Settings {
  /**
   * Managed storage keys supported by New Tab Override.
   *
   * @type {string[]}
   */
  static #managedKeys = ['background_color', 'context_rules', 'focus_website', 'type', 'url'];

  /**
   * New tab types that can be configured through enterprise policies.
   *
   * @type {string[]}
   */
  static #supportedManagedTypes = ['background_color', 'custom_url', 'homepage'];

  /**
   * Regular expression used to validate managed background colors.
   *
   * @type {RegExp}
   */
  static #backgroundColorRegex = /^#[\da-f]{6}$/i;

  /**
   * Check whether a value is a plain object.
   *
   * @param {any} value - value to check
   *
   * @returns {boolean} - whether the value is a plain object
   */
  static #isPlainObject (value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Validate and normalize a managed URL.
   *
   * @param {any} value - managed URL value
   * @param {object} options - validation options
   *
   * @returns {string|null} - sanitized URL, or null if the value is invalid
   */
  static #sanitizeUrl (value, options = {}) {
    const { allowEmpty = true, allowFileUrl = true, allowUnsupportedProtocol = true } = options;

    if (typeof value !== 'string') {
      return null;
    }

    const url = value.trim();

    if (Utils.uriRegex.test(url)) {
      return url;
    }

    if ((allowEmpty && url === '') || (allowFileUrl && url.startsWith('file://'))) {
      return url;
    }

    if (allowUnsupportedProtocol && Utils.protocolRegex.test(url)) {
      return url;
    }

    if (Utils.protocolRegex.test(url) || url === '') {
      return null;
    }

    return 'https://' + url;
  }

  /**
   * Validate and normalize managed context-specific URL rules.
   *
   * @param {any} contextRules - managed context rules
   *
   * @returns {{containers: object, groups: object}|null} - sanitized context rules, or null if the value is invalid
   */
  static #sanitizeContextRules (contextRules) {
    if (!Settings.#isPlainObject(contextRules)) {
      return null;
    }

    const sanitizedContextRules = {
      containers: {},
      groups: {}
    };

    for (const scope of ['containers', 'groups']) {
      if (Settings.#isPlainObject(contextRules[scope])) {
        for (const [identifier, value] of Object.entries(contextRules[scope])) {
          const ruleIdentifier = identifier.trim();
          const url = Settings.#sanitizeUrl(value, {
            allowEmpty: false,
            allowFileUrl: false,
            allowUnsupportedProtocol: false
          });

          if (ruleIdentifier && url !== null) {
            sanitizedContextRules[scope][ruleIdentifier] = url;
          }
        }
      }
    }

    return sanitizedContextRules;
  }

  /**
   * Read the managed settings supported by New Tab Override.
   *
   * @returns {Promise<object>} - validated managed settings that are actually applied
   */
  static async getManaged () {
    if (!browser.storage.managed) {
      return {};
    }

    try {
      const managedSettings = await browser.storage.managed.get(Settings.#managedKeys);
      const sanitizedSettings = {};

      if (Object.hasOwn(managedSettings, 'type') && Settings.#supportedManagedTypes.includes(managedSettings.type)) {
        sanitizedSettings.type = managedSettings.type;
      }

      if (Object.hasOwn(managedSettings, 'url') && typeof managedSettings.url === 'string') {
        const url = Settings.#sanitizeUrl(managedSettings.url);

        if (url !== null) {
          sanitizedSettings.url = url;
        }
      }

      if (Object.hasOwn(managedSettings, 'focus_website') && typeof managedSettings.focus_website === 'boolean') {
        sanitizedSettings.focus_website = managedSettings.focus_website;
      }

      if (Object.hasOwn(managedSettings, 'background_color') && typeof managedSettings.background_color === 'string') {
        if (Settings.#backgroundColorRegex.test(managedSettings.background_color)) {
          sanitizedSettings.background_color = managedSettings.background_color.toLowerCase();
        }
      }

      if (Object.hasOwn(managedSettings, 'context_rules')) {
        const contextRules = Settings.#sanitizeContextRules(managedSettings.context_rules);

        if (contextRules !== null) {
          sanitizedSettings.context_rules = contextRules;
        }
      }

      return sanitizedSettings;
    }
    catch {
      return {};
    }
  }

  /**
   * Read the current settings, with managed settings overriding local settings for supported keys.
   *
   * @returns {Promise<{managedKeys: string[], values: object}>} - current settings and keys controlled by policies
   */
  static async get () {
    const [localSettings, managedSettings] = await Promise.all([
      browser.storage.local.get(Defaults.values),
      Settings.getManaged()
    ]);
    const contextRules = localSettings.context_rules;

    localSettings.context_rules = {
      containers: contextRules?.containers && typeof contextRules.containers === 'object' &&
        !Array.isArray(contextRules.containers) ? contextRules.containers : {},
      groups: contextRules?.groups && typeof contextRules.groups === 'object' &&
        !Array.isArray(contextRules.groups) ? contextRules.groups : {}
    };

    return {
      managedKeys: Object.keys(managedSettings),
      values: { ...localSettings, ...managedSettings }
    };
  }
}
