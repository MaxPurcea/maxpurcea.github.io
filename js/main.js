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
