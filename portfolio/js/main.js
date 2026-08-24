/* ==========================================================================
   ENGINEER'S BLUEPRINT — interactions
   Theme · IST clock · Lenis smooth scroll · GSAP reveals · agent-graph
   canvas · live GitHub strip. No dependencies beyond the CDN libs in HTML.
   ========================================================================== */

(function () {
  'use strict';

  var GH_USER = 'aditya0si';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initClocks();
    initSmoothScroll();
    initReveals();
    initAgentGraph(document.getElementById('agent-graph'));
    initChapters();
    initScrollZoom();
    initCursor();
    initMagnetic();
    initHeroMouseParallax();
    initGitHubStrip();
    initWeatherDemo();
    document.getElementById('year').textContent = new Date().getFullYear();
  });

  /* --- Theme (A = cream, B = dark) ------------------------------------- */

  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById('theme-toggle');
    var stored = null;
    try { stored = localStorage.getItem('as-theme'); } catch (e) { /* private mode */ }

    applyTheme(stored === 'b' ? 'b' : 'a');

    btn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'a' ? 'b' : 'a');
    });

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      btn.textContent = 'THEME[' + theme.toUpperCase() + ']';
      btn.setAttribute('aria-pressed', theme === 'b' ? 'true' : 'false');
      try { localStorage.setItem('as-theme', theme); } catch (e) { /* private mode */ }
      document.dispatchEvent(new CustomEvent('themechange'));
    }
  }

  /* --- Clocks (IST) ------------------------------------------------------ */

  function initClocks() {
    var hud = document.getElementById('ist-clock');
    var footer = document.getElementById('footer-clock');
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    var short = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false
    });

    function tick() {
      var now = new Date();
      hud.textContent = 'IST ' + fmt.format(now);
      hud.setAttribute('datetime', now.toISOString());
      footer.textContent = 'IST ' + short.format(now);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* --- Smooth scroll + progress bar --------------------------------------- */

  function initSmoothScroll() {
    var bar = document.querySelector('.scroll-progress');

    if (prefersReducedMotion || typeof Lenis === 'undefined') {
      // Native scrolling; keep the progress bar alive.
      var onScroll = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      wireAnchors(function (target) { target.scrollIntoView(); });
      return;
    }

    var lenis = new Lenis({ duration: 1.1, smoothTouch: false });

    var skewTicker = typeof gsap !== 'undefined'
      ? gsap.quickTo('.ticker', 'skewY', { duration: 0.5, ease: 'power2.out' })
      : null;
    var settleSkew = 0;

    lenis.on('scroll', function (e) {
      bar.style.transform = 'scaleX(' + (e.limit > 0 ? e.scroll / e.limit : 0) + ')';
      if (skewTicker && typeof e.velocity === 'number') {
        skewTicker(Math.max(-5, Math.min(5, e.velocity * 0.4)));
        clearTimeout(settleSkew);
        settleSkew = setTimeout(function () { skewTicker(0); }, 150);
      }
    });

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    wireAnchors(function (target) {
      lenis.scrollTo(target, { offset: -64 });
    });
  }

  function wireAnchors(scrollTo) {
    document.querySelectorAll('a[data-scroll]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        scrollTo(target);
      });
    });
  }

  /* --- Scroll reveals -------------------------------------------------------- */

  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    var lines = document.querySelectorAll('.hero-name .line-inner');

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    gsap.from(lines, {
      yPercent: 112,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.12,
      delay: 0.15
    });

    els.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () { el.classList.add('in'); }
      });
    });
  }

  /* --- Custom cursor (the ▮ motif follows the pointer) ------------------- */

  function initCursor() {
    if (!finePointer || prefersReducedMotion || typeof gsap === 'undefined') return;
    var cursor = document.getElementById('cursor');
    if (!cursor) return;

    document.body.classList.add('has-cursor');
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    var xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3.out' });
    var yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3.out' });

    window.addEventListener('pointermove', function (e) {
      cursor.classList.add('is-visible');
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) cursor.classList.add('is-link');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button')) cursor.classList.remove('is-link');
    });
    document.documentElement.addEventListener('mouseleave', function () {
      cursor.classList.remove('is-visible');
    });
  }

  /* --- Magnetic elements --------------------------------------------------- */

  function initMagnetic() {
    if (!finePointer || prefersReducedMotion || typeof gsap === 'undefined') return;

    document.querySelectorAll('.btn, .theme-btn, .project-link').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * 0.25);
        yTo((e.clientY - rect.top - rect.height / 2) * 0.25);
      });
      el.addEventListener('pointerleave', function () {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* --- Hero pointer parallax (layers drift at different rates) --------------- */

  function initHeroMouseParallax() {
    if (!finePointer || prefersReducedMotion || typeof gsap === 'undefined') return;
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var nameX = gsap.quickTo('.hero-name', 'x', { duration: 0.9, ease: 'power3.out' });
    var nameY = gsap.quickTo('.hero-name', 'y', { duration: 0.9, ease: 'power3.out' });
    var lineX = gsap.quickTo('.hero-line', 'x', { duration: 1.1, ease: 'power3.out' });
    var lineY = gsap.quickTo('.hero-line', 'y', { duration: 1.1, ease: 'power3.out' });
    var eyebrowX = gsap.quickTo('.eyebrow', 'x', { duration: 1.3, ease: 'power3.out' });
    var eyebrowY = gsap.quickTo('.eyebrow', 'y', { duration: 1.3, ease: 'power3.out' });

    hero.addEventListener('pointermove', function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      nameX(nx * 18); nameY(ny * 12);
      lineX(nx * -10); lineY(ny * -7);
      eyebrowX(nx * -14); eyebrowY(ny * -8);
    }, { passive: true });
  }

  /* --- Story chapters: pinned scroll-zoom through the narrative --------------- */

  function initChapters() {
    if (typeof gsap === 'undefined') return;
    var chapters = document.querySelector('.chapters');
    if (!chapters) return;

    var mm = gsap.matchMedia();

    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', function () {
      var items = gsap.utils.toArray('.chapter', chapters);
      var BEAT = 1.0; // timeline seconds per chapter
      var IN = 0.7;   // zoom in/out duration inside a beat

      chapters.classList.add('chapters--pin');
      gsap.set(items, { autoAlpha: 0, scale: 0.84 });
      gsap.set(items[0], { autoAlpha: 1, scale: 1 });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: chapters,
          start: 'top top',
          end: '+=' + (BEAT * items.length * 100) + '%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1
        }
      });

      items.forEach(function (item, i) {
        var at = i * BEAT;
        if (i > 0) {
          // the next chapter emerges from depth while the previous passes
          tl.fromTo(item,
            { scale: 0.84, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: IN, ease: 'power2.out' }, at - 0.2);
        }
        tl.to(item, {
          scale: i === items.length - 1 ? 1.12 : 1.3,
          autoAlpha: 0,
          duration: IN,
          ease: 'power1.in'
        }, at + 0.3);
      });

      return function () {
        chapters.classList.remove('chapters--pin');
        gsap.set(items, { clearProps: 'all' });
      };
    });
  }

  /* --- Scroll zoom ------------------------------------------------------------ */

  function initScrollZoom() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    // Hero recedes like a title card; the graph counter-zooms.
    gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: true }
    })
      .fromTo('.hero-inner',
        { filter: 'blur(0px)' },
        { scale: 0.88, y: -70, autoAlpha: 0, filter: 'blur(6px)', ease: 'none' }, 0)
      .to('#agent-graph', { scale: 1.12, ease: 'none' }, 0);

    // Project names settle from slightly over-scaled.
    gsap.utils.toArray('.project-name').forEach(function (name) {
      gsap.fromTo(name, { scale: 1.1 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: name, start: 'top 95%', end: 'top 55%', scrub: true }
      });
    });

    // Contact title is the finale — zoom up into place.
    gsap.fromTo('.contact-title', { scale: 0.8, autoAlpha: 0 }, {
      scale: 1, autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: '.contact', start: 'top 90%', end: 'center 60%', scrub: true }
    });
  }

  /* --- Agent graph canvas -------------------------------------------------------
     Signature element: a live orchestration graph — square nodes, nearest
     edges, one token walking the graph and tracing its path in accent.
  ----------------------------------------------------------------------------- */

  function initAgentGraph(canvas) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var NODE_COUNT = 26;
    var EDGE_DEGREE = 2;
    var WALK_MS = 1500;
    var TRAIL_MS = 2200;

    var colors = readColors();
    var nodes = [];
    var edges = [];
    var adjacency = [];
    var mouse = { x: -1e4, y: -1e4 };
    var running = false;
    var rafId = 0;
    var lastFrame = 0;

    // token = edge index + progress along it
    var token = { edge: 0, progress: 0 };
    var trail = [];

    buildGraph();

    var reduced = prefersReducedMotion;
    if (!reduced) {
      canvas.parentElement.addEventListener('pointermove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      canvas.parentElement.addEventListener('pointerleave', function () {
        mouse.x = -1e4; mouse.y = -1e4;
      });

      // Skip drawing when the hero is out of view (rAF stays warm so the
      // observer can never double-start the loop).
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            running = entry.isIntersecting;
            if (running && !rafId) rafId = requestAnimationFrame(frame);
          });
        }).observe(canvas);
      } else {
        running = true;
      }
    }

    document.addEventListener('themechange', function () { colors = readColors(); });
    window.addEventListener('resize', resize);
    resize();
    if (reduced) { draw(Date.now()); } else { rafId = requestAnimationFrame(frame); }

    /* --- internals --- */

    function readColors() {
      var css = getComputedStyle(document.documentElement);
      return {
        node: css.getPropertyValue('--line-strong').trim(),
        edge: css.getPropertyValue('--line').trim(),
        accent: css.getPropertyValue('--accent').trim()
      };
    }

    function buildGraph() {
      var rand = mulberry32(20050817); // stable layout across loads
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: rand(), y: rand(),
          nx: 0, ny: 0, px: 0, py: 0,
          ox: 0, oy: 0 // cursor-repulsion offset
        });
      }
      nodes.forEach(function (node) {
        node.nx = 0.06 + node.x * 0.88;   // keep clear of viewport edges
        node.ny = 0.08 + node.y * 0.84;
      });
      adjacency = nodes.map(function () { return []; });
      var seen = {};
      nodes.forEach(function (node, idx) {
        nearest(node, idx).forEach(function (other) {
          var key = Math.min(idx, other) + '-' + Math.max(idx, other);
          if (seen[key]) return;
          seen[key] = true;
          edges.push([idx, other]);
          adjacency[idx].push(edges.length - 1);
          adjacency[other].push(edges.length - 1);
        });
      });
      token.edge = adjacency[0][0] || 0;
    }

    function nearest(node, self) {
      var scored = nodes
        .map(function (n, i) { return { i: i, d: dist2(node, n) }; })
        .filter(function (s) { return s.i !== self; })
        .sort(function (a, b) { return a.d - b.d; });
      return scored.slice(0, EDGE_DEGREE).map(function (s) { return s.i; });
    }

    function mulberry32(seed) {
      return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function dist2(a, b) {
      var dx = a.nx - b.nx, dy = a.ny - b.ny;
      return dx * dx + dy * dy;
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes.forEach(function (node) {
        node.px = node.nx * rect.width;
        node.py = node.ny * rect.height;
      });
    }

    function frame(now) {
      rafId = 0;
      if (running) {
        var dt = lastFrame ? Math.min(now - lastFrame, 100) : 16;
        lastFrame = now;
        stepToken(dt);
        draw(now);
      } else {
        lastFrame = 0;
      }
      if (!reduced) rafId = requestAnimationFrame(frame);
    }

    function stepToken(dt) {
      token.progress += dt / WALK_MS;
      trail.push({ edge: token.edge, at: performance.now() });
      if (token.progress >= 1) {
        token.progress = 0;
        var pair = edges[token.edge];
        var options = adjacency[pair[0]]
          .concat(adjacency[pair[1]])
          .filter(function (ei) { return ei !== token.edge; });
        token.edge = options.length
          ? options[Math.floor(Math.random() * options.length)]
          : token.edge;
      }
    }

    function draw(now) {
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Cursor field: nodes repel from the pointer and ease back, so the
      // whole graph (edges included) bends around the mouse.
      var REPEL_RADIUS = 130;
      var REPEL_PULL = 18;
      nodes.forEach(function (node) {
        var dx = node.px - mouse.x;
        var dy = node.py - mouse.y;
        var dist = Math.hypot(dx, dy);
        var strength = dist < REPEL_RADIUS ? 1 - dist / REPEL_RADIUS : 0;
        var tx = dist > 0 ? (dx / dist) * strength * REPEL_PULL : 0;
        var ty = dist > 0 ? (dy / dist) * strength * REPEL_PULL : 0;
        node.ox += (tx - node.ox) * 0.12;
        node.oy += (ty - node.oy) * 0.12;
      });

      function px(node) { return node.px + node.ox; }
      function py(node) { return node.py + node.oy; }

      // base edges
      ctx.strokeStyle = colors.edge;
      ctx.lineWidth = 1;
      edges.forEach(function (pair) {
        ctx.beginPath();
        ctx.moveTo(px(nodes[pair[0]]), py(nodes[pair[0]]));
        ctx.lineTo(px(nodes[pair[1]]), py(nodes[pair[1]]));
        ctx.stroke();
      });

      // token trail (accent, fading)
      var cutoff = now - TRAIL_MS;
      trail = trail.filter(function (t) { return t.at >= cutoff; });
      ctx.strokeStyle = colors.accent;
      trail.forEach(function (t) {
        var pair = edges[t.edge];
        var alpha = Math.max(0, 1 - (now - t.at) / TRAIL_MS) * 0.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(px(nodes[pair[0]]), py(nodes[pair[0]]));
        ctx.lineTo(px(nodes[pair[1]]), py(nodes[pair[1]]));
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // nodes: squares near the pointer light up in accent
      nodes.forEach(function (node) {
        var near = Math.hypot(px(node) - mouse.x, py(node) - mouse.y) < 100;
        var size = near ? 6 : 4;
        ctx.fillStyle = near ? colors.accent : colors.node;
        ctx.fillRect(px(node) - size / 2, py(node) - size / 2, size, size);
      });

      // the token itself, mid-edge
      if (!reduced) {
        var pair = edges[token.edge];
        var a = nodes[pair[0]], b = nodes[pair[1]];
        var x = px(a) + (px(b) - px(a)) * token.progress;
        var y = py(a) + (py(b) - py(a)) * token.progress;
        ctx.fillStyle = colors.accent;
        ctx.fillRect(x - 4, y - 4, 8, 8);
      }
    }
  }

  /* --- Live GitHub strip ---------------------------------------------------------- */

  /* --- WeatherGPT live demo --------------------------------------------- */

  function initWeatherDemo() {
    var form = document.getElementById('wg-form');
    var input = document.getElementById('wg-city');
    var btn = document.getElementById('wg-go');
    var statusEl = document.getElementById('wg-status');
    var currentEl = document.getElementById('wg-current');
    var daysEl = document.getElementById('wg-days');
    if (!form || !input || !window.fetch) return;

    // Primary: the deployed WeatherGPT FastAPI backend. Fallback: direct
    // Open-Meteo call so the demo still works when the free tier sleeps.
    var API_BASES = [
      'https://weathergpt-api.onrender.com',
      'https://api.open-meteo.com/v1'
    ];
    var apiBaseIndex = -1; // resolved on first successful fetch

    // WMO weather codes → icon + label
    var WMO = {
      0: ['☀', 'Clear sky'], 1: ['🌤', 'Mainly clear'], 2: ['⛅', 'Partly cloudy'],
      3: ['☁', 'Overcast'], 45: ['🌫', 'Fog'], 48: ['🌫', 'Rime fog'],
      51: ['🌦', 'Light drizzle'], 53: ['🌦', 'Drizzle'], 55: ['🌧', 'Heavy drizzle'],
      61: ['🌧', 'Light rain'], 63: ['🌧', 'Rain'], 65: ['🌧', 'Heavy rain'],
      71: ['🌨', 'Light snow'], 73: ['🌨', 'Snow'], 75: ['❄', 'Heavy snow'],
      80: ['🌦', 'Rain showers'], 81: ['🌧', 'Showers'], 82: ['⛈', 'Violent showers'],
      95: ['⛈', 'Thunderstorm'], 96: ['⛈', 'Storm w/ hail'], 99: ['⛈', 'Storm w/ hail']
    };
    function wmo(code) { return WMO[code] || ['·', '—']; }

    function setStatus(text, isError) {
      statusEl.textContent = text;
      statusEl.classList.toggle('demo-error', !!isError);
    }

    function setBusy(busy) {
      btn.disabled = busy;
      btn.textContent = busy ? '…' : 'FETCH ▸';
    }

    function geocode(city) {
      return window.fetch(
        'https://geocoding-api.open-meteo.com/v1/search' +
        '?name=' + encodeURIComponent(city) + '&count=1&language=en&format=json'
      ).then(function (res) {
        if (!res.ok) throw new Error('geocode ' + res.status);
        return res.json();
      }).then(function (data) {
        var hit = data && data.results && data.results[0];
        if (!hit) throw new Error('City not found — try another spelling');
        return hit;
      });
    }

    // Fetch via whichever base works; returns normalized payload.
    function fetchForecast(place, lat, lon) {
      var attempt = function (idx) {
        if (idx >= API_BASES.length) throw new Error('All API endpoints unreachable');
        apiBaseIndex = idx;
        var base = API_BASES[idx];
        var url;
        if (base.indexOf('weathergpt') !== -1) {
          url = base + '/api/v1/weather/forecast?location=' +
            encodeURIComponent(place) + '&days=5';
          return window.fetch(url).then(function (res) {
            if (!res.ok) throw new Error('backend ' + res.status);
            return res.json().then(function (j) {
              return {
                via: 'WeatherGPT API',
                current: j.current,
                daily: (j.daily || []).slice(0, 5)
              };
            });
          });
        }
        // Direct Open-Meteo fallback
        url = base + '/forecast?latitude=' + lat + '&longitude=' + lon +
          '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
          '&daily=weather_code,temperature_2m_max,temperature_2m_min,' +
          'precipitation_probability_max&timezone=auto&forecast_days=5';
        return window.fetch(url).then(function (res) {
          if (!res.ok) throw new Error('open-meteo ' + res.status);
          return res.json();
        }).then(function (j) {
          return {
            via: 'Open-Meteo direct',
            current: {
              temperature_c: j.current.temperature_2m,
              relative_humidity_pct: j.current.relative_humidity_2m,
              weather_code: j.current.weather_code,
              wind_speed_kmh: j.current.wind_speed_10m,
              weather_desc: wmo(j.current.weather_code)[1]
            },
            daily: (j.daily.time || []).map(function (d, i) {
              return {
                date: d,
                weather_code: j.daily.weather_code[i],
                temperature_max_c: j.daily.temperature_2m_max[i],
                temperature_min_c: j.daily.temperature_2m_min[i],
                precipitation_probability_pct: j.daily.precipitation_probability_max[i]
              };
            })
          };
        });
      };

      return attempt(apiBaseIndex === -1 ? 0 : apiBaseIndex)
        .catch(function () { return attempt(apiBaseIndex === 0 ? 1 : 0); });
    }

    function render(data, place, ms) {
      var cur = data.current;
      var icon = wmo(cur.weather_code);
      document.getElementById('wg-icon').textContent = icon[0];
      document.getElementById('wg-temp').textContent = Math.round(cur.temperature_c);
      document.getElementById('wg-desc').textContent =
        cur.weather_desc || icon[1];
      document.getElementById('wg-place').textContent = place.toUpperCase();
      document.getElementById('wg-hum').textContent =
        Math.round(cur.relative_humidity_pct) + '%';
      document.getElementById('wg-wind').textContent =
        Math.round(cur.wind_speed_kmh) + ' KM/H';

      var dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      daysEl.innerHTML = '';
      (data.daily || []).forEach(function (d) {
        var dt = new Date(d.date + 'T12:00:00');
        var li = document.createElement('li');
        li.className = 'demo-day';
        li.innerHTML =
          '<span class="demo-day-name"></span>' +
          '<span class="demo-day-icon" aria-hidden="true"></span>' +
          '<span class="demo-day-temp"></span>' +
          '<span class="demo-day-pop"></span>';
        li.children[0].textContent = dayNames[dt.getDay()];
        li.children[1].textContent = wmo(d.weather_code)[0];
        li.children[2].textContent =
          Math.round(d.temperature_max_c) + '° / ' + Math.round(d.temperature_min_c) + '°';
        li.children[3].textContent =
          d.precipitation_probability_pct != null
            ? d.precipitation_probability_pct + '%'
            : '—';
        daysEl.appendChild(li);
      });

      currentEl.hidden = false;
      daysEl.hidden = false;
      document.getElementById('wg-latency').textContent =
        data.via + ' · ' + ms + 'MS · LIVE DATA';
      setStatus('');
      statusEl.hidden = true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var city = input.value.trim();
      if (!city) return;

      setBusy(true);
      statusEl.hidden = false;
      currentEl.hidden = true;
      daysEl.hidden = true;
      setStatus('Fetching forecast for “' + city + '”…');

      var t0 = performance.now();
      geocode(city)
        .then(function (hit) {
          var label = [hit.name, hit.admin1, hit.country]
            .filter(Boolean).join(', ');
          return fetchForecast(label, hit.latitude, hit.longitude)
            .then(function (data) {
              render(data, label, Math.round(performance.now() - t0));
            });
        })
        .catch(function (err) {
          setStatus(err.message || 'Fetch failed — try again', true);
        })
        .then(function () { setBusy(false); });
    });

    // Auto-load on scroll into view so visitors see live data immediately.
    if ('IntersectionObserver' in window) {
      var seen = false;
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !seen) {
            seen = true;
            obs.disconnect();

            var t0 = performance.now();
            geocode('Mumbai')
              .then(function (hit) {
                return fetchForecast(hit.name + ', India', hit.latitude, hit.longitude)
                  .then(function (data) {
                    render(data, hit.name + ', India',
                      Math.round(performance.now() - t0));
                  });
              })
              .catch(function () {
                setStatus('Live API waking up — type a city and hit FETCH', true);
              });
          }
        });
      }, { threshold: 0.3 }).observe(document.getElementById('wg-demo'));
    }
  }

  /* --- Live from GitHub --------------------------------------------------- */

  function initGitHubStrip() {
    var strip = document.getElementById('gh-strip');
    var latest = document.getElementById('latest-push');
    if (!strip || !window.fetch) return; // static fallback stays

    var monthYear = new Intl.DateTimeFormat('en-GB', {
      month: 'short', year: 'numeric'
    });

    // Trust boundary: the API is external, so only accept well-formed
    // records whose links point back at github.com.
    function isRepoRecord(repo) {
      return repo && typeof repo.name === 'string' &&
        typeof repo.html_url === 'string' &&
        repo.html_url.indexOf('https://github.com/') === 0 &&
        !isNaN(new Date(repo.pushed_at).getTime());
    }

    window.fetch('https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=pushed')
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub API ' + res.status);
        return res.json();
      })
      .then(function (repos) {
        var live = repos
          .filter(function (repo) { return !repo.fork && isRepoRecord(repo); })
          .sort(function (a, b) { return b.pushed_at.localeCompare(a.pushed_at); })
          .slice(0, 8);

        if (!live.length) return;

        strip.innerHTML = '';
        live.forEach(function (repo) {
          var row = document.createElement('a');
          row.className = 'gh-row';
          row.href = repo.html_url;
          row.target = '_blank';
          row.rel = 'noopener';
          row.innerHTML =
            '<span class="gh-name"></span>' +
            '<span class="gh-meta"></span>' +
            '<span class="gh-meta"></span>';
          row.children[0].textContent = repo.name;
          row.children[1].textContent = (repo.language || '—').toUpperCase();
          row.children[2].textContent = monthYear.format(new Date(repo.pushed_at)).toUpperCase();
          strip.appendChild(row);
        });

        latest.textContent = monthYear.format(new Date(live[0].pushed_at)).toUpperCase();

        // Live repo counts (hero + about). The API returns max 100 per page,
        // so only trust the count when it's under the page cap.
        var total = repos.filter(function (repo) { return !repo.fork; }).length;
        if (total > 0 && total < 100) {
          ['hero-repo-count', 'about-repo-count'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.textContent = String(total);
          });
        }
      })
      .catch(function () {
        // API down or rate-limited: the static fallback already in the DOM stays.
        latest.textContent = 'AUG 2026';
      });
  }
})();
