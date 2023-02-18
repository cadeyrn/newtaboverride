'use strict';

const PERMISSION_FEED = { origins : ['https://www.soeren-hentzschel.at/*'] };

// match any "protocol://" URI
const URI_REGEX = /^[^:]+:\/\//;

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
    const major = versionParts[0] ? parseInt(versionParts[0]) : 0;
    const minor = versionParts[1] ? parseInt(versionParts[1]) : 0;
    const patch = versionParts[2] ? parseInt(versionParts[2]) : 0;

    return { major, minor, patch };
  }
};
