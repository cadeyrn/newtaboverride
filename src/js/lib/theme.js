'use strict';

class Theme {
  /**
   * Storage key used for the settings interface theme.
   *
   * @type {string}
   */
  static #storageKey = 'theme';

  /**
   * Theme used when no valid user preference exists.
   *
   * @type {string}
   */
  static #defaultTheme = 'auto';

  /**
   * Supported theme modes for the settings interface.
   *
   * @type {string[]}
   */
  static #supportedThemes = ['auto', 'light', 'dark'];

  /**
   * Apply the selected theme to the document.
   *
   * @param {string} theme - selected theme
   *
   * @returns {string} - normalized theme
   */
  static apply (theme) {
    const normalizedTheme = Theme.#supportedThemes.includes(theme) ? theme : Theme.#defaultTheme;

    document.documentElement.dataset.theme = normalizedTheme;

    return normalizedTheme;
  }

  /**
   * Load the saved theme and apply it to the document.
   *
   * @returns {Promise<string>} - applied theme
   */
  static async load () {
    try {
      const themeSetting = await browser.storage.local.get({ [Theme.#storageKey]: Theme.#defaultTheme });

      return Theme.apply(themeSetting[Theme.#storageKey]);
    }
    catch {
      return Theme.apply(Theme.#defaultTheme);
    }
  }

  /**
   * Persist and apply the selected theme.
   *
   * @param {string} theme - selected theme
   *
   * @returns {Promise<string>} - applied theme
   */
  static async save (theme) {
    const normalizedTheme = Theme.apply(theme);

    await browser.storage.local.set({ [Theme.#storageKey]: normalizedTheme });

    return normalizedTheme;
  }
}

void Theme.load();
