const elType = document.querySelector('#type');
const elUrlOption = document.querySelector('#url_option');
const elUrl = document.querySelector('#url');
const elFocusWebsite = document.querySelector('#focus_website');
const elClearLocationBar = document.querySelector('#clear_locationbar');

function toggleUrlOption() {
  elUrlOption.style.display = (elType.options[elType.selectedIndex].value == 'custom_url') ? 'block' : 'none';
}

// show preferences
self.port.on('show-preferences', (preferences) => {
  elType.querySelector('[value="' + preferences.prefs['type'] + '"]').selected = true;
  elUrl.value = preferences.prefs['url'];
  elFocusWebsite.checked = preferences.prefs['focus_website'];
  elClearLocationBar.checked = preferences.prefs['clear_locationbar'];
  toggleUrlOption();
});

// listen to preference changes
elType.addEventListener('change', function () {
  self.port.emit('change-preference', { key : 'type', value : this.value });
  toggleUrlOption();
});

elUrl.addEventListener('input', function () {
  self.port.emit('change-preference', { key : 'url', value : this.value });
});

elFocusWebsite.addEventListener('change', function () {
  self.port.emit('change-preference', { key : 'focus_website', value : this.checked });
});

elClearLocationBar.addEventListener('change', function () {
  self.port.emit('change-preference', { key : 'clear_locationbar', value : this.checked });
});
