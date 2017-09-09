'use strict';

/* global defaults */

/**
 * @exports backgroundcolor
 */
const backgroundcolor = {
  async init () {
    const { background_color } = await browser.storage.local.get({ background_color : defaults.background_color });
    document.body.style.background = background_color;
  }
};

backgroundcolor.init();
