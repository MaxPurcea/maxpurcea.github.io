// Small, dependency-free helpers for the portfolio (~3 KB).
(function () {
  window.__mp = true; // tells the head script that this file loaded (see reveal fallback)
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');

  // Sticky header shadow once scrolled
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle('open', open);
      if (header) header.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && links.classList.contains('open')) { setOpen(false); toggle.focus(); } });
    document.addEventListener('click', function (e) { if (links.classList.contains('open') && !e.target.closest('.nav')) setOpen(false); });
  }

  // Reveal-on-scroll (.reveal on the home page, .glide on case studies).
  // Elements that enter together get a small stagger so grids cascade in.
  var els = document.querySelectorAll('.reveal, .glide');
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.setProperty('--d', Math.min(n++ * 80, 320) + 'ms');
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Hero streamlines: potential flow past a cylinder (psi = y(1 - R^2/r^2)), stretched into an
  // ellipse around the portrait and recomputed from its real position, so lines bend around it at any size.
  var flowSvg = document.querySelector('.hero-flow');
  var flowBody = document.querySelector('.hero .portrait');
  if (flowSvg && flowBody) {
    var hero = flowSvg.parentElement, raf = 0;
    var solve = function (xs, c) { // smallest y > body surface with y - y/(x^2+y^2) = c
      var lo = xs * xs < 1 ? Math.sqrt(1 - xs * xs) : 0, hi = c + 2, mid;
      for (var it = 0; it < 26; it++) { mid = (lo + hi) / 2; if (mid - mid / (xs * xs + mid * mid) < c) lo = mid; else hi = mid; }
      return (lo + hi) / 2;
    };
    var drawFlow = function () {
      raf = 0;
      var W = hero.clientWidth, H = hero.clientHeight; if (!W || !H) return;
      var hr = hero.getBoundingClientRect(), br = flowBody.getBoundingClientRect();
      var cx = br.left - hr.left + br.width / 2, cy = br.top - hr.top + br.height / 2;
      var ax = br.width * 0.6, ay = br.height * 0.58;         // ellipse hugging the portrait
      var gap = W < 700 ? 30 : 44, step = W < 700 ? 12 : 20, out = '';
      var nUp = Math.ceil(cy / gap) + 1, nDn = Math.ceil((H - cy) / gap) + 1;
      for (var j = -nUp; j < nDn; j++) {
        var Y0 = cy + (j + 0.5) * gap, c = Math.abs(Y0 - cy) / ay, sg = Y0 < cy ? -1 : 1, d = '';
        for (var x = -step; x <= W + step; x += step) {
          var y = solve((x - cx) / ax, c);
          d += (d ? ' ' : 'M') + x + ' ' + (cy + sg * y * ay).toFixed(1);
        }
        var aj = Math.abs(j + 0.5), pulse = aj === 1.5 || aj === 3.5 || aj === 6.5;
        out += '<path' + (pulse ? ' class="pulse" pathLength="1000"' : '') + ' d="' + d + '"/>';
      }
      flowSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      flowSvg.innerHTML = out;
    };
    var queue = function () { if (!raf) raf = requestAnimationFrame(drawFlow); };
    drawFlow();
    if ('ResizeObserver' in window) new ResizeObserver(queue).observe(hero); else window.addEventListener('resize', queue);
    var pImg = flowBody.querySelector('img'); if (pImg && !pImg.complete) pImg.addEventListener('load', queue, { once: true });
  }

  // Images fade in as they finish loading. If a download fails (flaky network, stale cache),
  // retry once with a fresh URL before giving up, so a photo never stays broken.
  document.querySelectorAll('main img').forEach(function (img) {
    var src = img.getAttribute('src'); if (!src) return;
    var retry = function () {
      if (img.dataset.retried) { img.classList.add('is-loaded'); return; }
      img.dataset.retried = '1';
      img.src = src + (src.indexOf('?') < 0 ? '?' : '&') + 'retry=' + Date.now();
    };
    var fade = !img.closest('.yaw-stage');
    if (img.complete && img.naturalWidth) return;          // already shown
    if (fade) img.classList.add('img-fade');
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    img.addEventListener('error', retry);
    if (img.complete && !img.naturalWidth && img.loading !== 'lazy') retry(); // failed before this ran
  });

  // Fade videos in once they can play, so nothing pops
  document.querySelectorAll('.glide video').forEach(function (v) {
    function ready() { v.classList.add('ready'); }
    if (v.readyState >= 3) ready(); else { v.addEventListener('canplay', ready, { once: true }); v.addEventListener('error', ready, { once: true }); }
  });

  // Project-card spotlight follows the pointer (desktop pointers only)
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Highlight the nav link for the section in view (home page)
  var navA = links ? links.querySelectorAll('a[href^="#"]') : [];
  if (navA.length && hasIO) {
    var map = {};
    navA.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navA.forEach(function (a) { a.classList.remove('active'); });
        var a = map[en.target.id]; if (a) a.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).concat('top').forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // Theme toggle (remembers choice per browser; the head script applies it before paint)
  var btn = document.getElementById('theme-btn');
  if (btn) {
    var done = function () { root.classList.remove('theme-vt'); };
    var label = function () {
      var dark = root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    };
    label();
    btn.addEventListener('click', function () {
      var cur = root.getAttribute('data-theme');
      if (!cur) cur = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var next = cur === 'dark' ? 'light' : 'dark';
      var apply = function () { root.setAttribute('data-theme', next); label(); };
      if (document.startViewTransition && !reduce) {
        root.classList.add('theme-vt');
        document.startViewTransition(apply).finished.then(done, done);
      } else apply();
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
