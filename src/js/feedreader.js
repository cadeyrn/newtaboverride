'use strict';

// one hour in milliseconds
const INTERVAL_BETWEEN_FETCHES_IN_MS = 3600000;

/**
 * @exports feedreader
 */
const feedreader = {
  lastFetched : null,
  feedItems : null,

  /**
   * Checks for new feed items, only once per INTERVAL_BETWEEN_FETCHES_IN_MS milliseconds.
   *
   * @param {string} url - the URL to load
   *
   * @returns {Array.Object} - an array with the content of all feed items
   */
  getFeedItems (url) {
    if (feedreader.feedItems === null || (Date.now() - feedreader.lastFetched > INTERVAL_BETWEEN_FETCHES_IN_MS)) {
      feedreader.feedItems = feedreader.fetch(url);
    }

    return feedreader.feedItems;
  },

  /**
   * Loads the content for a given URL via fetch() API and assign the content of the feed items to an object. Returns
   * an array with all of feed item objects.
   *
   * @param {string} url - the URL to load
   *
   * @returns {Array.Object} - an array with the content of all feed items
   */
  async fetch (url) {
    const feeditems = [];

    const parser = new DOMParser();
    const response = await fetch(url, { cache : 'no-store' });
    const text = await response.text();
    const doc = await parser.parseFromString(text, 'text/xml');

    if (doc === null) {
      return feeditems;
    }

    const items = doc.querySelectorAll('item');

    for (let i = 0; i < items.length; i++) {
      const feeditem = {};
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
