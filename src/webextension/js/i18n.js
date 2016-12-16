'use strict';

const i18n = {
  findWithXPath : function (path) {
    return document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  },

  getMessage : function (string, key) {
    return chrome.i18n.getMessage(key);
  },

  replace : function (string) {
    return string.replace(/__MSG_([a-z_.]+)__/gi, i18n.getMessage);
  },

  translate : function () {
    document.removeEventListener('DOMContentLoaded', i18n.translate);

    const textNodes = i18n.findWithXPath('//text()[contains(self::text(), "__MSG_")]');
    for (let i = 0, length = textNodes.snapshotLength; i < length; i++) {
      const text = textNodes.snapshotItem(i);
      text.nodeValue = i18n.replace(text.nodeValue);
    }

    const placeholderAttributes = i18n.findWithXPath('//*/attribute::placeholder[contains(., "__MSG_")]');
    for (let i = 0, length = placeholderAttributes.snapshotLength; i < length; i++) {
      const placeholder = placeholderAttributes.snapshotItem(i);
      placeholder.value = i18n.replace(placeholder.value);
    }
  }
};

window.addEventListener('DOMContentLoaded', i18n.translate);
