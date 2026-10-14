(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // dark mode
  document.getElementById('themeBtn').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // mobile menu
  var side = document.getElementById('sidebar'), burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = side.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  side.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () { side.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  });

  // typed cursive name
  var typed = document.getElementById('typed'), full = 'Monica Kandela!', i = 0;
  function type() {
    typed.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(type, 110);
  }
  if (reduce) typed.textContent = full; else setTimeout(type, 400);

  // role rotator
  var roles = ['Data Analyst', 'Business Analyst', 'SQL & Python Problem-Solver', 'Dashboard Builder'], r = 0, rot = document.getElementById('rotator');
  if (!reduce) setInterval(function () {
    rot.classList.add('out');
    setTimeout(function () { r = (r + 1) % roles.length; rot.textContent = roles[r]; rot.classList.remove('out'); }, 300);
  }, 2600);

  // reveal + counters
  function count(el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null;
    if (reduce) { el.textContent = end + suf; return; }
    (function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(e.target);
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // active nav link
  var links = {};
  document.querySelectorAll('.nav a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === e.target.id); });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { so.observe(s); });

  // project filters
  var btns = document.querySelectorAll('.filters button'), projs = document.querySelectorAll('.proj');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.toggle('on', x === b); });
      projs.forEach(function (p) {
        var show = b.dataset.f === 'all' || p.dataset.cat.split(' ').indexOf(b.dataset.f) > -1;
        p.classList.toggle('hide', !show);
      });
    });
  });

  // cursor glow
  var glow = document.getElementById('glow');
  if (!reduce) addEventListener('pointermove', function (e) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
