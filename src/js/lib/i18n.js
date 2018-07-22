'use strict';

/**
 * @exports i18n
 */
const i18n = {
  /**
   * Fired when the initial HTML document has been completely loaded and parsed. Starts the translation of all the
   * strings.
   *
   * @returns {void}
   */
  init () {
    i18n.translate();
    i18n.setLangAttribute();
  },

  /**
   * This method is used to set the lang attribute to the <html> element.
   *
   * @returns {void}
   */
  setLangAttribute () {
    document.querySelector('html').setAttribute('lang', browser.i18n.getUILanguage());
  },

  /**
   * This method is used to get the translation for a given key.
   *
   * @param {string} key - translsation key
   *
   * @returns {string} - translation
   */
  getMessage (key) {
    return browser.i18n.getMessage(key);
  },

  /**
   * Translates all strings in the page
   *
   * @returns {void}
   */
  translate () {
    document.removeEventListener('DOMContentLoaded', i18n.translate);

    const nodes = document.querySelectorAll('[data-i18n]');

    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      const children = Array.from(node.children);
      const text = i18n.getMessage(node.dataset.i18n);
      node.innerHTML = '';
      const parts = text.split(/(\{\d+\})/);
      parts.forEach((part) => {
        if ((/\{\d+\}/).test(part)) {
          const index = parseInt(part.slice(1));
          node.appendChild(children[index]);
        }
        else {
          node.appendChild(document.createTextNode(part));
        }
      });
    }

    const attributes = ['placeholder', 'data-confirm'];
    for (const attribute of attributes) {
      const i18nAttribute = `data-i18n-${attribute}`;
      const attrNodes = document.querySelectorAll(`[${i18nAttribute}]`);

      for (let i = 0, len = attrNodes.length; i < len; i++) {
        const node = attrNodes[i];
        const msg = node.getAttribute(i18nAttribute);
        node.setAttribute(attribute, i18n.getMessage(msg));
      }
    }
  }
};

window.addEventListener('DOMContentLoaded', i18n.init);
