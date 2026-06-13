'use strict';

/* global FeedReader */

class Feed {
  static #elThrobber = document.getElementById('throbber').parentElement;

  static #permission = { origins: ['https://www.soeren-hentzschel.at/*'] };

  static #url = 'https://www.soeren-hentzschel.at/feed/';

  static #elPermissionNeeded = document.getElementById('permission-needed');

  /**
   * This method checks if the permission is granted to read the feed. If so it reads the feed, otherwise it shows
   * an error message and a link to the options page.
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
      Feed.#elThrobber.remove();
      Feed.#elPermissionNeeded.classList.remove('hidden');
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
    Feed.#elThrobber.remove();

    for (let i = 0; i < items.length; i++) {
      const date = new Date(items[i].pubDate);
      const dateAsString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

      // strip HTML from description
      let description = items[i].description.replace(/<(?:.|\n)*?>/gm, '');

      // remove last paragraph from soeren-hentzschel.at feed
      description = description.replace(/(.*)\s*Der Beitrag.* erschien zuerst auf.*/, '$1');

      const docFragment = document.createDocumentFragment();

      const li = document.createElement('li');
      docFragment.appendChild(li);

      const small = document.createElement('small');
      li.appendChild(small);
      const text1 = document.createTextNode(browser.i18n.getMessage('feed_published_at') + ' ' + dateAsString);
      small.appendChild(text1);

      let { link } = items[i];
      const hasValidWebLink = link.startsWith('https://');

      if (hasValidWebLink) {
        const url = new URL(link);
        url.searchParams.set('utm_campaign', 'webext');
        url.searchParams.set('utm_term', 'newtaboverride');
        link = url.toString();

        const a1 = document.createElement('a');
        a1.setAttribute('href', link);
        a1.setAttribute('target', '_blank');
        a1.setAttribute('rel', 'noopener');
        li.appendChild(a1);

        const strong = document.createElement('strong');
        a1.appendChild(strong);
        const text2 = document.createTextNode(items[i].title);
        strong.appendChild(text2);
      }

      const paragraph = document.createElement('p');
      li.appendChild(paragraph);
      const text3 = document.createTextNode(description);
      paragraph.appendChild(text3);

      if (hasValidWebLink) {
        const a2 = document.createElement('a');
        a2.setAttribute('href', link);
        a2.setAttribute('class', 'button readmore-button');
        a2.setAttribute('target', '_blank');
        a2.setAttribute('rel', 'noopener');
        li.appendChild(a2);

        const text4 = document.createTextNode(browser.i18n.getMessage('feed_read_more'));
        a2.appendChild(text4);
      }

      document.getElementById('feed-items').appendChild(docFragment);
    }
  }
}

Feed.init();
