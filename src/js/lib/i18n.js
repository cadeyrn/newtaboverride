'use strict';

class I18n {
  /**
   * Start the translation of all the strings.
   *
   * @returns {void}
   */
  static init () {
    I18n.#setLangAttribute();
    I18n.#translate();
  }

  /**
   * Translate a message and return the translation key if no translation is available.
   *
   * @param {string} key - translation key
   * @param {string|string[]|null} substitutions - substitutions for placeholders in the translation
   *
   * @returns {string} - the translated message or the key if no translation is available
   */
  static getMessage (key, substitutions = null) {
    const message = browser.i18n.getMessage(key, substitutions);

    return message ? message : key;
  }

  /**
   * Set the lang attribute of the <html> element.
   *
   * @returns {void}
   */
  static #setLangAttribute () {
    document.querySelector('html').setAttribute('lang', browser.i18n.getUILanguage());
  }

  /**
   * Translate all strings in text nodes, placeholders, and title attributes.
   *
   * @returns {void}
   */
  static #translate () {
    document.removeEventListener('DOMContentLoaded', I18n.#translate);

    // text node translation
    const $nodes = document.querySelectorAll('[data-i18n]');

    $nodes.forEach($node => {
      const $children = Array.from($node.children);
      const text = I18n.getMessage($node.dataset.i18n);
      const parts = text.split(/({\d+})/);

      parts.forEach(part => {
        if ((/{\d+}/).test(part)) {
          const idx = parseInt(part.slice(1));
          $node.appendChild($children[idx]);
        }
        else {
          $node.appendChild(document.createTextNode(part));
        }
      });

      $node.removeAttribute('data-i18n');
    });

    // attribute translation
    const attributes = ['placeholder', 'title'];

    for (const attribute of attributes) {
      const i18nAttribute = `data-i18n-${attribute}`;
      const $attrNodes = document.querySelectorAll(`[${i18nAttribute}]`);

      $attrNodes.forEach($node => {
        const msg = $node.getAttribute(i18nAttribute);
        $node.setAttribute(attribute, I18n.getMessage(msg));
        $node.removeAttribute(i18nAttribute);
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', I18n.init);
