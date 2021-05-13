'use strict';

/* global feedreader */

const FEED_PERMISSION = { origins : ['https://www.soeren-hentzschel.at/*'] };
const FEED_URL = 'https://www.soeren-hentzschel.at/feed/';

const elPermissionNeeded = document.getElementById('permission-needed');

/**
 * @exports feed
 */
const feed = {
  /**
   * This method checks if the permission is granted to read the feed. If so it reads the feed, otherwise it shows
   * an error message and a link to the options page.
   *
   * @returns {void}
   */
  async init () {
    const isAllowed = await browser.permissions.contains(FEED_PERMISSION);

    // permission is granted
    if (isAllowed) {
      const result = await feedreader.getFeedItems(FEED_URL);
      feed.readFeedItems(result);
    }
    // permission is not granted
    else {
      document.getElementById('throbber').remove();
      elPermissionNeeded.classList.remove('hidden');
    }
  },

  /**
   * This method is used to read the news feed defined in FEED_URL.
   *
   * @param {Array.Object} items - an array with feed items
   *
   * @returns {void}
   */
  readFeedItems (items) {
    document.getElementById('throbber').remove();

    for (let i = 0; i < items.length; i++) {
      const date = new Date(items[i].pubDate);
      const dateAsString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

      // strip html from description
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

      const br1 = document.createElement('br');
      li.appendChild(br1);

      const { link } = items[i];
      const hasValidWebLink = link.startsWith('https://');

      if (hasValidWebLink) {
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

      const br2 = document.createElement('br');
      li.appendChild(br2);

      const p = document.createElement('p');
      li.appendChild(p);
      const text3 = document.createTextNode(description);
      p.appendChild(text3);

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
};

feed.init();
