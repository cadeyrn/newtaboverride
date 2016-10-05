const elType = document.querySelector('#type');
const elUrl = document.querySelector('#url');

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
