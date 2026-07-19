'use strict';

class Defaults {
  /**
   * Default settings used to initialize and read stored options.
   *
   * @type {object}
   */
  static #values = {
    background_color: '#ffffff',
    context_rules: {
      containers: {},
      groups: {}
    },
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
