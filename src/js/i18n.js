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
    document.querySelector('html').setAttribute('lang', browser.i18n.getUILanguage().substring(0, 2));
  },

  /**
   * Returns an XPathResult based on a XPath expression.
   *
   * @param {string} path - a XPath expression
   *
   * @returns {XPathResult} - XPathResult based on an XPath expression
   */
  findWithXPath (path) {
    return document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  },

  /**
   * This method is used to get the translation for a given key.
   *
   * @param {string} string - not used parameter
   * @param {string} key - translsation key
   *
   * @returns {string} - translation
   */
  getMessage (string, key) {
    return browser.i18n.getMessage(key);
  },

  /**
   * Replaces a __MSG_<key>__ string with the correct translation.
   *
   * @param {string} string - __MSG_<key>__ string
   *
   * @returns {string} - translated string
   */
  replace (string) {
    return string.replace(/__MSG_([a-z_.]+)__/gi, i18n.getMessage);
  },

  /**
   * Translates all strings in text nodes, placesholders and title attributes.
   *
   * @returns {void}
   */
  translate () {
    document.removeEventListener('DOMContentLoaded', i18n.translate);

    const textNodes = i18n.findWithXPath('//text()[contains(self::text(), "__MSG_")]');
    const textSnapshotLength = textNodes.snapshotLength;

    for (let i = 0; i < textSnapshotLength; i++) {
      const text = textNodes.snapshotItem(i);
      text.nodeValue = i18n.replace(text.nodeValue);
    }

    const attributes = ['title', 'placeholder', 'data-confirm'];
    for (const attribute of attributes) {
      const nodes = i18n.findWithXPath('//*/attribute::' + attribute + '[contains(., "__MSG_")]');
      const AttributesSnapshotLength = nodes.snapshotLength;

      for (let i = 0; i < AttributesSnapshotLength; i++) {
        const node = nodes.snapshotItem(i);
        node.value = i18n.replace(node.value);
      }
    }
  }
};

window.addEventListener('DOMContentLoaded', i18n.init);
