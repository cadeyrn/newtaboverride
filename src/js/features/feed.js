'use strict';

/* global FeedReader */

class Feed {
  static #$throbber = document.getElementById('throbber').parentElement;

  static #permission = { origins: ['https://www.soeren-hentzschel.at/*'] };

  static #url = 'https://www.soeren-hentzschel.at/feed/';

  static #$permissionNeeded = document.getElementById('permission-needed');

  /**
   * This method checks if the permission is granted to read the feed. If so, it reads the feed, otherwise it shows
   * an error message and a link to the option page.
   *
   * @returns {void}
   */
  static async init () {
    const isAllowed = await browser.permissions.contains(Feed.#permission);

    if (isAllowed) {
      const result = await FeedReader.getFeedItems(Feed.#url);
      Feed.#readFeedItems(result);
    }
    else {
      Feed.#$throbber.remove();
      Feed.#$permissionNeeded.classList.remove('hidden');
    }
  }

  /**
   * This method is used to read the news feed defined in FEED_URL.
   *
   * @param {Array.object} items - an array with feed items
   *
   * @returns {void}
   */
  static #readFeedItems (items) {
    const $feedItems = document.getElementById('feed-items');
    const itemsLength = $feedItems.length;

    Feed.#$throbber.remove();

    for (let i = 0; i < itemsLength; i++) {
      const date = new Date(items[i].pubDate);
      const dateAsString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

      // strip HTML from description
      let description = items[i].description.replace(/<(?:.|\n)*?>/gm, '');

      // remove last paragraph from soeren-hentzschel.at feed
      description = description.replace(/(.*)\s*Der Beitrag.* erschien zuerst auf.*/, '$1');

      const $fragment = document.createDocumentFragment();

      const $listItem = document.createElement('li');
      $fragment.appendChild($listItem);

      const $publishedAt = document.createElement('small');
      $listItem.appendChild($publishedAt);
      const text1 = document.createTextNode(browser.i18n.getMessage('feed_published_at') + ' ' + dateAsString);
      $publishedAt.appendChild(text1);

      let { link } = items[i];
      const hasValidWebLink = link.startsWith('https://');

      if (hasValidWebLink) {
        const url = new URL(link);
        url.searchParams.set('utm_campaign', 'webext');
        url.searchParams.set('utm_term', 'newtaboverride');
        link = url.toString();

        const $titleLink = document.createElement('a');
        $titleLink.setAttribute('href', link);
        $titleLink.setAttribute('target', '_blank');
        $titleLink.setAttribute('rel', 'noopener');
        $listItem.appendChild($titleLink);

        const $title = document.createElement('strong');
        $titleLink.appendChild($title);
        const text2 = document.createTextNode(items[i].title);
        $title.appendChild(text2);
      }

      const $description = document.createElement('p');
      $listItem.appendChild($description);
      const text3 = document.createTextNode(description);
      $description.appendChild(text3);

      if (hasValidWebLink) {
        const $readMoreLink = document.createElement('a');
        $readMoreLink.setAttribute('href', link);
        $readMoreLink.setAttribute('class', 'button readmore-button');
        $readMoreLink.setAttribute('target', '_blank');
        $readMoreLink.setAttribute('rel', 'noopener');
        $listItem.appendChild($readMoreLink);

        const text4 = document.createTextNode(browser.i18n.getMessage('feed_read_more'));
        $readMoreLink.appendChild(text4);
      }

      $feedItems.appendChild($fragment);
    }
  }
}

Feed.init();
