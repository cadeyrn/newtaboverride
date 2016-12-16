const elType = document.querySelector('#type');
const elUrl = document.querySelector('#url');

const options = {
  load : function () {
    function setType(result) {
      const value = result.type || 'custom_url';
      elType.querySelector('[value="' + value + '"]').selected = true;
    }

    function setUrl(result) {
      elUrl.value = result.url || 'about:newtab';
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    let type = browser.storage.local.get('type');
    type.then(setType, onError);

    let url = browser.storage.local.get('url');
    url.then(setUrl, onError);
  }
};

document.addEventListener('DOMContentLoaded', options.load);

elType.addEventListener('change', function () {
  browser.storage.local.set({'type' : this.value});
});

elUrl.addEventListener('input', function () {
  browser.storage.local.set({'url' : this.value});
});
