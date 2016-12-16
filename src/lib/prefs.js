const simplePrefs = require('sdk/simple-prefs');

exports.syncLegacyDataPort = function (port) {
  // Send the initial data dump.
  port.postMessage({
    prefs: {
      type: simplePrefs.prefs['type'],
      url: simplePrefs.prefs['url']
    }
  });

  // Keep the preferences in sync with the data stored in the webextension.
  simplePrefs.on('type', () => {
    port.postMessage({
      prefs: {
        type: simplePrefs.prefs['type']
      }
    });
  });

  simplePrefs.on('url', () => {
    port.postMessage({
      prefs: {
        url: simplePrefs.prefs['url']
      }
    });
  });
};
