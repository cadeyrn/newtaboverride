'use strict';

/* global defaults */

/**
 * @exports localfile
 */
const localfile = {
  async init () {
    const body = document.querySelector('body');
    const { local_file } = await browser.storage.local.get({ local_file : defaults.local_file });

    // The file has been uploaded by the user. Therefore, the user wants the content, regardless of possible problems
    // eslint-disable-next-line no-unsanitized/method
    body.insertAdjacentHTML('beforeend', local_file);

    // set page title if there is a title tag in the document
    const match = local_file.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (match) {
      // eslint-disable-next-line require-atomic-updates
      document.title = match[1];
    }
  }
};

localfile.init();
