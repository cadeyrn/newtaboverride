self.port.on('feed-items', (items) => {
  document.getElementById('throbber').remove();

  for (let i = 0; i < items.length; i++) {
    let date = new Date(items[i].pubDate);
    let dateAsString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    let el = document.createElement('li');
    el.innerHTML = '<li><small>' + window.global_i18n.feed_published_at + ' ' + dateAsString + '</small><br />' +
      '<a href="' + items[i].link + '"><strong>' + items[i].title + '</strong></a><br />' + items[i].description +
      '<a href="' + items[i].link + '" class="button">' + window.global_i18n.feed_read_more + '</a></li>';
    document.getElementById('feed-items').appendChild(el);
  }
});
