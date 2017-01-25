'use strict';

const elType = document.getElementById('type');
const elUrlOption = document.getElementById('url_option');
const elUrl = document.getElementById('url');
const elFocusWebsite = document.getElementById('focus_website');
const elClearLocationBar = document.getElementById('clear_locationbar');

const options = {
  toggleUrlOption : function () {
    elUrlOption.style.display = (elType.options[elType.selectedIndex].value == 'custom_url') ? 'block' : 'none';
  },

  load : function () {
    browser.storage.local.get({ 'type' : 'custom_url' }).then((option) => {
      elType.querySelector('[value="' + option.type + '"]').selected = true;
      options.toggleUrlOption();
    });

    browser.storage.local.get({ 'url' : 'about:newtab' }).then((option) => {
      elUrl.value = option.url;
    });

    browser.storage.local.get({ 'focus_website' : false }).then((option) => {
      elFocusWebsite.checked = option.focus_website;
    });

    browser.storage.local.get({ 'clear_locationbar' : false }).then((option) => {
      elClearLocationBar.checked = option.clear_locationbar;
    });
  }
};

document.addEventListener('DOMContentLoaded', options.load);

elType.addEventListener('change', function () {
  browser.storage.local.set({ 'type' : this.value });
  options.toggleUrlOption();
});

elUrl.addEventListener('input', function () {
  browser.storage.local.set({ 'url' : this.value });
});

elFocusWebsite.addEventListener('change', function () {
  browser.storage.local.set({ 'focus_website' : this.checked });
});

elClearLocationBar.addEventListener('change', function () {
  browser.storage.local.set({ 'clear_locationbar' : this.checked });
});
