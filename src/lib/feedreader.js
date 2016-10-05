const INTERVAL_BETWEEN_FETCHES_IN_MS = 3600000; // 1 hour
const { XMLHttpRequest } = require('sdk/net/xhr');

const feedreader = {
  lastFetched : null,
  feedItems : null,

  getFeedItems : function (url) {
    if (feedreader.feedItems === null || (Date.now() - feedreader.lastFetched > INTERVAL_BETWEEN_FETCHES_IN_MS)) {
      feedreader.feedItems = feedreader.fetch(url);
    }

    return feedreader.feedItems;
  },

  fetch : function (url) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();

      xhr.onload = function() {
        let feeditems = [];
        let doc = this.responseXML;

        if (doc === null) {
          return feeditems;
        }

        let items = doc.querySelectorAll('item');

        for (let i = 0; i < items.length; i++) {
          let feeditem = {};
          feeditem.title = items[i].getElementsByTagName('title')[0].textContent;
          feeditem.description = items[i].getElementsByTagName('description')[0].textContent;
          feeditem.link = items[i].getElementsByTagName('link')[0].textContent;
          feeditem.pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
          feeditems.push(feeditem);
        }

        feedreader.lastFetched = Date.now();

        resolve(feeditems);
      };

      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.send();
    });
  }
};

exports.getFeedItems = feedreader.getFeedItems;
