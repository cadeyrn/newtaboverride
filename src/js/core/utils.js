'use strict';

class Utils {
  static #feedPermission = { origins: ['https://www.soeren-hentzschel.at/*'] };

  static #uriRegex = /^(https?|moz-extension):\/\//i;

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

  /**
   * This method is used for version comparisons. It parses a given version number string and splits it into a major,
   * a minor and a patch component.
   *
   * @param {string} version - version number as string
   *
   * @returns {{major: (int), minor: (int), patch: (int)}} - object with major, minor and patch component of version
   */
  static parseVersion (version) {
    const versionParts = version.split('.');
    const major = versionParts[0] ? parseInt(versionParts[0]) : 0;
    const minor = versionParts[1] ? parseInt(versionParts[1]) : 0;
    const patch = versionParts[2] ? parseInt(versionParts[2]) : 0;

    return { major, minor, patch };
  }
}
