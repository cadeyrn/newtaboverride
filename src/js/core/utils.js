'use strict';

/**
 * @exports utils
 */
const utils = {
  /**
   * This method is used for version comparisons. It parses a given version number string and splits it into a major,
   * a minor and a patch component.
   *
   * @param {string} version - version number as string
   *
   * @returns {{major: (int), minor: (int), patch: (int)}} - object with major, minor and patch component of version
   */
  parseVersion (version) {
    const versionParts = version.split('.');
    const major = parseInt(versionParts[0]) || 0;
    const minor = parseInt(versionParts[1]) || 0;
    const patch = parseInt(versionParts[2]) || 0;

    return { major, minor, patch };
  }
};
