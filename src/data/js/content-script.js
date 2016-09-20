const elType = document.querySelector('#type');
const elUrl = document.querySelector('#url');

// set favicon
self.port.on('data-url', function(baseurl) {
  let link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = baseurl + 'images/icon-32.png';
  document.getElementsByTagName('head')[0].appendChild(link);
});

// translate HTML elements
self.port.on('i18n', function (t) {
  let items = document.querySelectorAll('[data-l10n-id]');
  for (let item of items) {
    if (item.dataset.l10nId.endsWith('.placeholder')) {
      item.setAttribute('placeholder', t[item.dataset.l10nId]);
    } else {
      item.textContent = t[item.dataset.l10nId];
    }
  }
});

// show preferences
self.port.on('show-preferences', (preferences) => {
  elType.querySelector('[value="' + preferences.prefs['type'] + '"]').selected = true;
  elUrl.value = preferences.prefs['url'];
});

// listen to preference changes
elType.addEventListener('change', function () {
  self.port.emit('change-preference', { key : 'type', value : this.value });
});

elUrl.addEventListener('input', function () {
  self.port.emit('change-preference', { key : 'url', value : this.value });
});
