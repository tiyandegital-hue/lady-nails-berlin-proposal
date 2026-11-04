/* LADY NAILS — shared site config + interactions (no external libs) */
(function () {
  'use strict';

  /* ONE swappable business-name constant */
  var SITE = {
    biz: 'Lady Nails',
    telDisplay: '+49(0)30 26078619',
    telHref: 'tel:+493026078619',
    mobDisplay: '015238423966',
    mobHref: 'tel:+4915238423966',
    street: 'Petersburger Straße 93',
    city: '10247 Berlin',
    area: 'Friedrichshain'
  };

  /* Fill business-name constant into any [data-biz] element */
  document.querySelectorAll('[data-biz]').forEach(function (el) {
    el.textContent = SITE.biz;
  });

  /* ---- Generic filter chips: [data-filter] controls [data-cat] cards ---- */
  document.querySelectorAll('[data-filter-group]').forEach(function (group) {
    var chips = group.querySelectorAll('[data-filter]');
    var scope = group.getAttribute('data-filter-scope');
    var cards = document.querySelectorAll('[data-cat-scope="' + scope + '"] [data-cat]');
    var countEl = document.querySelector('[data-count-for="' + scope + '"]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        chip.setAttribute('aria-pressed', 'true');
        var f = chip.getAttribute('data-filter');
        var n = 0;
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-cat') || '').split(' ');
          var show = f === 'all' || cats.indexOf(f) !== -1;
          card.style.display = show ? '' : 'none';
          if (show) n++;
        });
        if (countEl) countEl.textContent = n + '/' + cards.length + ' GELADEN';
      });
    });
  });

  /* ---- Booking mock state ---- */
  var svcData = {
    club:   { name: 'SIGNATURE CLUB SET',  price: 70, dur: '~ 90 MIN' },
    acid:   { name: 'GRAPHIC MINIMAL',     price: 60, dur: '~ 75 MIN' },
    refill: { name: 'REGULAR RETOUCH',     price: 42, dur: '~ 60 MIN' },
    pflege: { name: 'APPARATIVE PFLEGE',   price: 35, dur: '~ 45 MIN' }
  };
  var bp = document.getElementById('boarding-pass');
  if (bp) {
    var state = { svc: 'club', day: 'FR 28', slot: '17:15' };
    var elSvc = document.getElementById('bp-service'),
        elDur = document.getElementById('bp-dur'),
        elDay = document.getElementById('bp-day'),
        elSlot = document.getElementById('bp-slot'),
        elPrice = document.getElementById('bp-price');

    function renderBP() {
      var s = svcData[state.svc];
      if (elSvc) elSvc.textContent = s.name;
      if (elDur) elDur.textContent = 'Dauer: ca. ' + s.dur.replace('~ ', '');
      if (elDay) elDay.textContent = state.day;
      if (elSlot) elSlot.textContent = state.slot + ' Uhr';
      if (elPrice) elPrice.textContent = s.price + ' €';
    }

    document.querySelectorAll('.svc').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.svc').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        state.svc = btn.getAttribute('data-svc');
        renderBP();
      });
    });
    document.querySelectorAll('.day').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.day').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        state.day = btn.getAttribute('data-day');
        renderBP();
      });
    });
    document.querySelectorAll('.slot:not([disabled])').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.slot').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        state.slot = btn.getAttribute('data-slot');
        renderBP();
      });
    });
    renderBP();
  }

  /* ---- FAQ accordion (keyboard-native buttons) ---- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    var item = q.closest('.faq-item');
    var panel = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    });
  });

  /* ---- Star rating (Bewertungen) ---- */
  var starRow = document.getElementById('star-row');
  var starOut = document.getElementById('star-out');
  if (starRow) {
    starRow.querySelectorAll('.star').forEach(function (btn) {
      btn.addEventListener('click', function () {
        starRow.querySelectorAll('.star').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var v = btn.getAttribute('data-stars');
        if (starOut) starOut.textContent = v + ' / 5 STERNE';
      });
    });
  }

  /* ---- Demo forms: never send, show explicit demo notice ---- */
  function demoNotice(form, extra) {
    var box = form.querySelector('.form-result');
    if (!box) return;
    var msg = 'KONZEPT-DEMO // ' + (extra || 'DIESES FORMULAR SENDET NICHTS AB.') +
      '<br>KEINE DATEN ÜBERTRAGEN. VERBINDLICH: ' + SITE.telDisplay + ' / ' + SITE.mobDisplay + '.';
    box.innerHTML = msg;
    box.classList.add('show');
    box.setAttribute('tabindex', '-1');
    box.focus();
  }
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      demoNotice(form, form.getAttribute('data-demo-msg'));
    });
  });

  /* ---- Review wall: pin demo sticker (client-side only) ---- */
  var reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('rv-name').value || 'ANONYM').toUpperCase().slice(0, 40);
      var text = document.getElementById('rv-text').value.slice(0, 220);
      if (!text.trim()) { demoNotice(reviewForm, 'BITTE ERST EIN FEEDBACK EINGEBEN.'); return; }
      var stars = '★★★★★';
      reviewForm.querySelectorAll('.star').forEach(function (b) {
        if (b.getAttribute('aria-pressed') === 'true') {
          stars = '★'.repeat(parseInt(b.getAttribute('data-stars'), 10));
        }
      });
      var color = 'ACID-LIME';
      reviewForm.querySelectorAll('input[name="rv-color"]').forEach(function (r) {
        if (r.checked) color = r.value;
      });
      var wall = document.getElementById('review-wall');
      var card = document.createElement('article');
      card.className = 'review';
      card.style.background = color === 'HOT-MAGENTA' ? 'var(--magenta)' : (color === 'DARK NOIR' ? '#1a1a1e' : 'var(--lime)');
      card.style.color = color === 'DARK NOIR' ? 'var(--ink)' : '#0B0B0D';
      card.innerHTML =
        '<span class="tape" aria-hidden="true"></span>' +
        '<p class="tag">COMMUNITY-STICKER // DEMO</p>' +
        '<p class="stars" aria-hidden="true">' + stars + '</p>' +
        '<blockquote>&bdquo;' + text.replace(/</g, '&lt;') + '&ldquo;</blockquote>' +
        '<p class="who">&mdash; ' + name.replace(/</g, '&lt;') + ' [MUSTERKUNDE]</p>' +
        '<p class="badge-line">SAMPLE // DEMO-EINTRAG</p>';
      wall.appendChild(card);
      demoNotice(reviewForm, 'STICKER ANGEHEFTET (DEMO) // NUR IN DIESEM BROWSER SICHTBAR.');
      reviewForm.reset();
    });
  }
})();
