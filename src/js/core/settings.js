'use strict';

/* global Defaults, Utils */

class Settings {
  /**
   * Managed storage keys supported by New Tab Override.
   *
   * @type {string[]}
   */
  static #managedKeys = ['background_color', 'focus_website', 'type', 'url'];

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
        const url = managedSettings.url.trim();

        if (Utils.uriRegex.test(url)) {
          sanitizedSettings.url = url;
        }
        else if (url === '' || url.startsWith('file://') || Utils.protocolRegex.test(url)) {
          sanitizedSettings.url = url;
        }
        else {
          sanitizedSettings.url = 'https://' + url;
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

      return sanitizedSettings;
    }
    catch {
      return {};
    }
  }

  /**
   * Read the current settings, with managed settings overriding local settings for supported keys.
   *
   * @returns {Promise<object>} - current settings
   */
  static async get () {
    const [localSettings, managedSettings] = await Promise.all([
      browser.storage.local.get(Defaults.values),
      Settings.getManaged()
    ]);

    return { ...localSettings, ...managedSettings };
  }
}
