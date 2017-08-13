'use strict';

/* global defaults */

/**
 * @exports backgroundcolor
 */
const backgroundcolor = {
  async init () {
    const options = await browser.storage.local.get(defaults);
    document.body.style.background = options.background_color;
  }
};

backgroundcolor.init();
