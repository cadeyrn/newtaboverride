'use strict';

class Utils {
  /**
   * Optional permission required to load the external feed
   *
   * @type {object}
   */
  static #feedPermission = { origins: ['https://www.soeren-hentzschel.at/*'] };

  /**
   * Regular expression used to validate supported URLs
   *
   * @type {RegExp}
   */
  static #uriRegex = /^(https?|moz-extension):\/\//i;

  /**
   * Regular expression used to detect whether the input already contains a protocol
   *
   * @type {RegExp}
   */
  static #protocolRegex = /^[^:^/]+:\/\//i;

  /**
   * Return the feed permission object used across the add-on.
   *
   * @returns {object} - permission object
   */
  static get feedPermission () {
    return Utils.#feedPermission;
  }

  /**
   * Return the regular expression used to validate supported URLs.
   *
   * @returns {RegExp} - URL regex
   */
  static get uriRegex () {
    return Utils.#uriRegex;
  }

  /**
   * Return the regular expression used to detect protocols.
   *
   * @returns {RegExp} - protocol regex
   */
  static get protocolRegex () {
    return Utils.#protocolRegex;
  }
}
