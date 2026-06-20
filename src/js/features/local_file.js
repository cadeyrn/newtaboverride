'use strict';

/* global Defaults */

class LocalFile {
  /**
   * Render the stored local file content as the current page.
   *
   * @returns {Promise<void>}
   */
  static async init () {
    const $body = document.querySelector('body');
    const { local_file } = await browser.storage.local.get({ local_file: Defaults.values.local_file });

    // The user has uploaded the file. Therefore, the user wants the content, regardless of possible problems.
    $body.insertAdjacentHTML('beforeend', local_file);

    // set page title if there is a title tag in the document
    const match = local_file.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (match) {
      // eslint-disable-next-line require-atomic-updates
      document.title = match[1];
    }
  }
}

void LocalFile.init();
