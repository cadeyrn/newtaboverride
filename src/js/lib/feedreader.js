'use strict';

class FeedReader {
  // one hour in milliseconds
  // eslint-disable-next-line no-magic-numbers
  static #intervalBetweenFetchesInMs = 3600000;

  static #lastFetched = null;

  static #feedItems = null;

  /**
   * Checks for new feed items, only once per INTERVAL_BETWEEN_FETCHES_IN_MS milliseconds.
   *
   * @param {string} url - the URL to load
   *
   * @returns {Array.object} - an array with the content of all feed items
   */
  static getFeedItems (url) {
    if (FeedReader.#feedItems === null || (Date.now() - FeedReader.#lastFetched > FeedReader.#intervalBetweenFetchesInMs)) {
      FeedReader.#feedItems = FeedReader.#fetch(url);
    }

    return FeedReader.#feedItems;
  }

  /**
   * Loads the content for a given URL via fetch() API and assign the content of the feed items to an object. Returns
   * an array with all of feed item objects.
   *
   * @param {string} url - the URL to load
   *
   * @returns {Array.object} - an array with the content of all feed items
   */
  static async #fetch (url) {
    const feedItems = [];

    const parser = new DOMParser();
    const response = await fetch(url, { cache: 'no-store' });
    const text = await response.text();
    const doc = await parser.parseFromString(text, 'text/xml');

    if (doc === null) {
      return feedItems;
    }

    const items = doc.querySelectorAll('item');

    for (let i = 0; i < items.length; i++) {
      const feedItem = {};
      feedItem.title = items[i].getElementsByTagName('title')[0].textContent;
      feedItem.description = items[i].getElementsByTagName('description')[0].textContent;
      feedItem.link = items[i].getElementsByTagName('link')[0].textContent;
      feedItem.pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;
      feedItems.push(feedItem);
    }

    FeedReader.#lastFetched = Date.now();

    return feedItems;
  }
}
