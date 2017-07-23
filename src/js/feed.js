'use strict';

const FEED_PERMISSION = { origins : ['https://www.soeren-hentzschel.at/*'] };
const FEED_URL = 'https://www.soeren-hentzschel.at/feed/';

const elPermissionNeeded = document.getElementById('permission-needed');

/**
 * @exports feed
 */
const feed = {
  async init () {
    const isAllowed = await browser.permissions.contains(FEED_PERMISSION);

    if (isAllowed) {
      const result = await feedreader.getFeedItems(FEED_URL);
      feed.readFeedItems(result);
    }
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
      let date = new Date(items[i].pubDate);
      let dateAsString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

      // strip html from description
      let description = items[i].description.replace(/<(?:.|\n)*?>/gm, '');

      // remove last paragraph from soeren-hentzschel.at feed
      description = description.replace(/(.*)\s*Der Beitrag.* erschien zuerst auf.*/, '$1');

      let docFragment = document.createDocumentFragment();

      let li = document.createElement('li');
      docFragment.appendChild(li);

      let small = document.createElement('small');
      li.appendChild(small);
      let text1 = document.createTextNode(browser.i18n.getMessage('feed_published_at') + ' ' + dateAsString);
      small.appendChild(text1);

      let br1 = document.createElement('br');
      li.appendChild(br1);

      let a1 = document.createElement('a');
      a1.setAttribute('href', items[i].link);
      a1.setAttribute('target', '_blank');
      a1.setAttribute('rel', 'noopener');
      li.appendChild(a1);

      let strong = document.createElement('strong');
      a1.appendChild(strong);
      let text2 = document.createTextNode(items[i].title);
      strong.appendChild(text2);

      let br2 = document.createElement('br');
      li.appendChild(br2);

      let p = document.createElement('p');
      li.appendChild(p);
      let text3 = document.createTextNode(description);
      p.appendChild(text3);

      let a2 = document.createElement('a');
      a2.setAttribute('href', items[i].link);
      a2.setAttribute('class', 'button readmore-button');
      a2.setAttribute('target', '_blank');
      a2.setAttribute('rel', 'noopener');
      li.appendChild(a2);

      let text4 = document.createTextNode(browser.i18n.getMessage('feed_read_more'));
      a2.appendChild(text4);

      document.getElementById('feed-items').appendChild(docFragment);
    }
  }
};

feed.init();
