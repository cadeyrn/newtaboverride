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
  }
};

localfile.init();
