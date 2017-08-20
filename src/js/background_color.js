'use strict';

/* global defaults */

/**
 * @exports backgroundcolor
 */
const backgroundcolor = {
  async init () {
    const options = await browser.storage.local.get({ background_color : defaults.background_color });
    document.body.style.background = options.background_color;
  }
};

backgroundcolor.init();
