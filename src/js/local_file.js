'use strict';

/* global defaults */

/**
 * @exports localfile
 */
const localfile = {
  async init () {
    const body = document.querySelector('body');
    const options = await browser.storage.local.get(defaults);

    body.insertAdjacentHTML('beforeend', options.local_file);
  }
};

localfile.init();
