/* SUVRON Money inner pages: small, independent enhancements. Every page works without this file. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* contact: copy an address, with a short confirmation on the button itself */
  $$('[data-copy]').forEach(function (b) {
    var label = b.querySelector('span');
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () {
        b.classList.add('is-done'); label.textContent = 'Copied';
        clearTimeout(b._t); b._t = setTimeout(function () { b.classList.remove('is-done'); label.textContent = 'Copy'; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { location.href = 'mailto:' + text; });
      else location.href = 'mailto:' + text;
    });
  });

  /* calculator: quick picks, filled slider tracks, the principal/interest bar, the sliding tab */
  var calc = $('#principal');
  if (calc) {
    var ranges = $$('.cl-field input[type="range"]');
    var tabs = $('.cl-tabs');
    var fill = function (r) { var p = (r.value - r.min) / (r.max - r.min) * 100; r.style.setProperty('--pct', p + '%'); };
    var marks = function () {
      $$('.cl-quick').forEach(function (q) {
        var inp = document.getElementById(q.getAttribute('data-for'));
        $$('button', q).forEach(function (b) { b.classList.toggle('is-on', +b.getAttribute('data-set') === +inp.value); });
      });
    };
    var num = function (id) { return +($('#' + id).textContent.replace(/[^\d.]/g, '')) || 0; };
    var bar = function () {
      var p = num('resultPrincipal'), i = num('resultInterest');
      $('.cl-bar__p').style.flexGrow = p; $('.cl-bar__i').style.flexGrow = Math.max(i, p * 0.004);
    };
    var live = $('#clLive'), lt, first = true;
    var say = function () {
      var t = $('#resultTotal').textContent, i = $('#resultInterest').textContent;
      $('#principal').setAttribute('aria-valuetext', $('#principalVal').textContent);
      $('#rate').setAttribute('aria-valuetext', $('#rateVal').textContent + ' a year');
      $('#tenure').setAttribute('aria-valuetext', $('#tenureVal').textContent);
      if (first) { first = false; return; }
      clearTimeout(lt); lt = setTimeout(function () { if (live) live.textContent = 'Total repayment ' + t + ', of which interest ' + i + '.'; }, 600);
    };
    var sync = function () { ranges.forEach(fill); marks(); requestAnimationFrame(function () { bar(); say(); }); };
    $$('.cl-quick button').forEach(function (b) {
      b.addEventListener('click', function () {
        var inp = document.getElementById(b.parentNode.getAttribute('data-for'));
        inp.value = b.getAttribute('data-set');
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    ranges.concat($$('#freq')).forEach(function (r) { r.addEventListener('input', sync); });
    $$('.cl-tabs button').forEach(function (b) {
      b.addEventListener('click', function () { tabs.classList.toggle('is-compound', b.id === 'tabCompound'); requestAnimationFrame(sync); });
    });
    sync();
  }

  /* 404: the report carries the address that failed */
  $$('[data-broken]').forEach(function (a) { a.href = '/contact/?subject=' + encodeURIComponent('Broken link: ' + location.href) + '#write'; });
  /* contact: a subject passed in the address fills the form */
  var subj = document.querySelector('#contactForm input[name="subject"]');
  if (subj) { var s = new URLSearchParams(location.search).get('subject'); if (s && !subj.value) subj.value = s.slice(0, 150); }

  /* blog: filter by topic */
  var filter = $('.bl-filter');
  if (filter) {
    var cards = $$('#blogGrid .bl-card'), empty = $('.bl-empty');
    $$('button', filter).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter'), shown = 0;
        $$('button', filter).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        cards.forEach(function (c) { var on = f === 'all' || c.getAttribute('data-tag') === f; c.hidden = !on; if (on) shown++; });
        empty.hidden = shown > 0;
      });
    });
  }

  /* article: the contents list follows the reader; closed by default on small screens */
  var toc = $('.ar-toc');
  if (toc) {
    if (matchMedia('(max-width: 1023px)').matches) toc.removeAttribute('open');
    var links = $$('a', toc), heads = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var mark = function () {
      var y = 120, on = -1;
      heads.forEach(function (h, i) { if (h && h.getBoundingClientRect().top < y) on = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-on', i === on); });
    };
    addEventListener('scroll', mark, { passive: true }); mark();
    links.forEach(function (a) { a.addEventListener('click', function () { if (matchMedia('(max-width: 1023px)').matches) toc.removeAttribute('open'); }); });
  }
})();
