(function(d) {
  var base = window.neulanadev ? "" : "replacethis";
  var i, count = 0;
  var client_url, client_id, client_secret, client_theme;

  function queryclass(name) {
    if (d.querySelectorAll) {
      return d.querySelectorAll('.' + name);
    }
    var elements = d.getElementsByTagName('div');
    var ret = [];
    for (i = 0; i < elements.length; i++) {
      if (~elements[i].className.split(' ').indexOf(name)) {
        ret.push(elements[i]);
      }
    }
    return ret;
  }

  function querydata(element, name) {
    return element.getAttribute('data-' + name);
  }

  function heighty(iframe) {
    if (window.addEventListener) {
      window.addEventListener('message', function(e) {
        if (iframe.id === e.data.sender) {
          iframe.height = e.data.height;
        }
      }, false);
    }
  }

  function render(card) {
    var theme = querydata(card, 'theme') || 'zhihu';
    cardurl = base + 'theme/' + theme + '.html';
    var userid = querydata(card, 'userid');
    if (!userid) {
      return;
    }
    count += 1;
    var width = querydata(card, 'width');
    var height = querydata(card, 'height');
    var key1 = querydata(card, 'key1') || 'follower';
    var key2 = querydata(card, 'key2') || 'book-collect';
    var key3 = querydata(card, 'key3') || 'movie-collect';
    var button = querydata(card, 'button') || "yes";
    var description = querydata(card, 'description') || "yes";
    var suffix = querydata(card, 'suffix') || "";
    var identity = 'dbcard-' + userid + '-' + count;

    var iframe = d.createElement('iframe');
    iframe.setAttribute('id', identity);
    iframe.setAttribute('frameborder', 0);
    iframe.setAttribute('scrolling', 0);
    iframe.setAttribute('allowtransparency', true);

    iframe.src = cardurl.concat('?userid=', userid, '&identity=', identity, "&button=", button, "&description=", description, '&key1=', key1, '&key2=', key2, '&key3=', key3, '&suffix=', suffix);
    iframe.width = width || Math.min(card.parentNode.clientWidth || 400, 400);
    if (height) {
      iframe.height = height;
    }
    heighty(iframe);
    card.parentNode.replaceChild(iframe, card);
    return iframe;
  }

  var cards = queryclass('zhihu-card');
  for (i = 0; i < cards.length; i++) {
    render(cards[i]);
  }
})(document);