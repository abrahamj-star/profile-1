(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Year
  $('#yr').textContent = new Date().getFullYear();

  // Theme toggle (persisted when storage is available)
  $('#themeBtn').addEventListener('click', function () {
    var dark = root.dataset.theme === 'dark' ||
      (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    var next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var btn = $('#menuBtn'), links = $('#links');
  function closeMenu() { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  $$('a', links).forEach(function (a) { a.addEventListener('click', closeMenu); });

  // Nav shadow on scroll
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // Reveal + active link via IntersectionObserver
  var sections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    var rev = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(function (el) { rev.observe(el); });

    var act = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          $$('a', links).forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { act.observe(s); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Publication filter
  var fbtns = $$('.filters button');
  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fbtns.forEach(function (x) { x.classList.toggle('on', x === b); });
      var f = b.dataset.f;
      $$('#pubs li').forEach(function (li) {
        li.hidden = f !== 'all' && li.dataset.t.split(' ').indexOf(f) === -1;
      });
    });
  });

  // Count-up stats
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
        (function tick(t) {
          var p = Math.min((t - t0) / 900, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suf : '');
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    });
    $$('[data-count]').forEach(function (el) { co.observe(el); });
  }
})();
