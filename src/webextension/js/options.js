const elType = document.querySelector('#type');
const elUrlOption = document.querySelector('#url_option');
const elUrl = document.querySelector('#url');
const elFocusWebsite = document.querySelector('#focus_website');
const elClearLocationBar = document.querySelector('#clear_locationbar');

const options = {
  load : function () {
    function toggleUrlOption() {
      elUrlOption.style.display = (elType.options[elType.selectedIndex].value == 'custom_url') ? 'block' : 'none';
    }

    function setType(result) {
      const value = result.type || 'custom_url';
      elType.querySelector('[value="' + value + '"]').selected = true;
      toggleUrlOption();
    }

    function setUrl(result) {
      elUrl.value = result.url || 'about:newtab';
    }

    function setFocusWebsite(result) {
      elFocusWebsite.checked = result.focus_website || false;
    }

    function setClearLocationBar(result) {
      elClearLocationBar.checked = result.clear_locationbar || false;
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    let type = browser.storage.local.get('type');
    type.then(setType, onError);

    let url = browser.storage.local.get('url');
    url.then(setUrl, onError);

    let focus_website = browser.storage.local.get('focus_website');
    focus_website.then(setFocusWebsite, onError);

    let clear_locationbar = browser.storage.local.get('clear_locationbar');
    clear_locationbar.then(setClearLocationBar, onError);
  }
};

document.addEventListener('DOMContentLoaded', options.load);

elType.addEventListener('change', function () {
  browser.storage.local.set({'type' : this.value});
  toggleUrlOption();
});

elUrl.addEventListener('input', function () {
  browser.storage.local.set({'url' : this.value});
});

elFocusWebsite.addEventListener('change', function () {
  browser.storage.local.set({'focus_website' : this.checked});
});

elClearLocationBar.addEventListener('change', function () {
  browser.storage.local.set({'clear_locationbar' : this.checked});
});
