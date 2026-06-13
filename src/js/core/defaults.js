'use strict';

class Defaults {
  static #values = {
    background_color: '#ffffff',
    focus_website: false,
    local_file: '',
    storage_schema: '1',
    type: 'custom_url',
    url: ''
  };

  /**
   * Return the default settings object.
   *
   * @returns {object} - default settings
   */
  static get values () {
    return Defaults.#values;
  }
}
