'use strict';

const INTERVAL_BETWEEN_FETCHES_IN_MS = 3600000; // 1 hour

/**
 * @exports feedreader
 */
const feedreader = {
  lastFetched : null,
  feedItems : null,

  getFeedItems : function (url) {
    if (feedreader.feedItems === null || (Date.now() - feedreader.lastFetched > INTERVAL_BETWEEN_FETCHES_IN_MS)) {
      feedreader.feedItems = feedreader.fetch(url);
    }

    return feedreader.feedItems;
  },

  fetch : async function (url) {
    let feeditems = [];

    const parser = new DOMParser();
    const response = await fetch(url, { cache : 'no-store' });
    const text = await response.text();
    const document = await parser.parseFromString(text, 'text/xml');

    if (document === null) {
      return feeditems;
    }

    let items = document.querySelectorAll('item');

    for (let i = 0; i < items.length; i++) {
      let feeditem = {};
      feeditem.title = items[i].getElementsByTagName('title')[0].textContent;
      feeditem.description = items[i].getElementsByTagName('description')[0].textContent;
      feeditem.link = items[i].getElementsByTagName('link')[0].textContent;
      feeditem.pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
      feeditems.push(feeditem);
    }

    feedreader.lastFetched = Date.now();

    return feeditems;
  }
};
