// set favicon
self.port.on('data-url', function(baseurl) {
  const link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = baseurl + 'images/icon-32.png';
  document.getElementsByTagName('head')[0].appendChild(link);
});

// translate HTML elements
self.port.on('i18n', function (t) {
  const items = document.querySelectorAll('[data-l10n-id]');
  window.global_i18n = { };

  for (let item of items) {
    if (item.dataset.l10nId.endsWith('.placeholder')) {
      item.setAttribute('placeholder', t[item.dataset.l10nId]);
    } else if (item.dataset.l10nId.endsWith('.global')) {
      let langItem = item.dataset.l10nId.slice(0, -7);
      window.global_i18n[langItem] = t[item.dataset.l10nId];
    } else {
      item.textContent = t[item.dataset.l10nId];
    }
  }
});
