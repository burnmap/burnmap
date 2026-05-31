/* ==========================================================================
   Burnmap LIGHT — interactivity
   ticker · waitlist form + count · smooth scroll · tweaks panel
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Smooth-scroll nav + CTAs ---- */
  document.querySelectorAll('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var el = document.getElementById(a.getAttribute('data-scroll'));
      if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    });
  });
  document.getElementById('nav-logo').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Live "wasted spend" ticker ---- */
  var WEEKLY_WASTE = 284000;
  var start = Date.now();
  var perSecond = WEEKLY_WASTE / (7 * 24 * 3600);
  var amountEl = document.getElementById('ticker-amount');
  setInterval(function () {
    var amount = ((Date.now() - start) / 1000) * perSecond;
    amountEl.textContent = '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, 100);

  /* ---- Waitlist count (shared across both forms) ---- */
  var count = 312;
  var countEls = document.querySelectorAll('[data-count]');
  function bumpCount() {
    count += 1;
    countEls.forEach(function (el) { el.textContent = count; });
  }

  /* ---- Waitlist forms (fake submit) ---- */
  document.querySelectorAll('[data-form]').forEach(function (mount) {
    var form = document.createElement('form');
    form.className = 'hero-form';
    form.innerHTML =
      '<input type="email" placeholder="you@example.com" required />' +
      '<button type="submit">Show me where my money is going</button>';
    mount.appendChild(form);

    var done = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (done) return;
      var input = form.querySelector('input');
      var btn = form.querySelector('button');
      if (!input.value) return;
      btn.disabled = true;
      btn.textContent = 'Please wait…';
      setTimeout(function () {
        var ok = document.createElement('div');
        ok.className = 'form-success';
        ok.textContent = "You're in. Check your inbox.";
        form.replaceWith(ok);
        done = true;
        bumpCount();
      }, 700);
    });
  });

  /* ======================================================================
     TWEAKS PANEL — accent shade · paper warmth · terminal theme
     ====================================================================== */
  var root = document.documentElement;
  var panel = document.getElementById('tw-panel');
  function set(k, v) { root.style.setProperty(k, v); }

  var ACCENTS = [
    { id: 'burn',    burn: '#FA3C14', hover: '#DF2C08', text: '#D72B07', dim: '#B85638' }, // logo
    { id: 'crimson', burn: '#E11D48', hover: '#BE123C', text: '#BE123C', dim: '#9F4456' },
    { id: 'amber',   burn: '#F59E0B', hover: '#D97706', text: '#B45309', dim: '#A1772E' },
    { id: 'cobalt',  burn: '#2563EB', hover: '#1D4ED8', text: '#1D4ED8', dim: '#4B6299' }
  ];

  // Surfaces + text + status, per theme. Light has warm/cool paper variants.
  var SURF = {
    light: {
      paper: {
        warm: { bg: '#FBF9F6', bg2: '#FFFFFF', bg3: '#F2EFE8', border: '#E7E1D6', borderMid: '#DAD3C5', nav: 'rgba(251,249,246,0.85)' },
        cool: { bg: '#F7F8FA', bg2: '#FFFFFF', bg3: '#EEF1F4', border: '#E3E7EC', borderMid: '#D2D8DF', nav: 'rgba(247,248,250,0.85)' }
      },
      text: '#151514', mid: '#55524B', dim: '#8C877C',
      status: { sBg: '#ECFDF3', sBorder: '#BBE8C9', success: '#15803D', error: '#DC2626' }
    },
    dark: {
      s: { bg: '#0D0F0F', bg2: '#111414', bg3: '#161A1A', border: '#1E2424', borderMid: '#2A3131', nav: 'rgba(13,15,15,0.85)' },
      text: '#E8E8E6', mid: '#9AA0A0', dim: '#6B7070',
      status: { sBg: '#052e16', sBorder: '#166534', success: '#4ADE80', error: '#F87171' }
    }
  };

  var state = { theme: 'light', accent: 'burn', paper: 'warm', term: 'dark' };
  try { var saved = JSON.parse(localStorage.getItem('bm-light-tweaks') || '{}'); Object.assign(state, saved); } catch (e) {}

  function applyAccent(id) {
    var a = ACCENTS.filter(function (x) { return x.id === id; })[0] || ACCENTS[0];
    set('--burn', a.burn); set('--burn-hover', a.hover); set('--burn-text', a.text); set('--burn-dim', a.dim);
    var c = a.burn.replace('#', '');
    var r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    set('--burn-glow', 'rgba(' + r + ',' + g + ',' + b + ',0.055)');
  }
  function applySurfaces() {
    if (state.theme === 'dark') {
      var d = SURF.dark, s = d.s;
      set('--bg', s.bg); set('--bg2', s.bg2); set('--bg3', s.bg3);
      set('--border', s.border); set('--border-mid', s.borderMid); set('--nav-bg', s.nav);
      set('--text', d.text); set('--text-mid', d.mid); set('--text-dim', d.dim);
      set('--success-bg', d.status.sBg); set('--success-border', d.status.sBorder); set('--success', d.status.success); set('--error', d.status.error);
    } else {
      var l = SURF.light, p = l.paper[state.paper] || l.paper.warm;
      set('--bg', p.bg); set('--bg2', p.bg2); set('--bg3', p.bg3);
      set('--border', p.border); set('--border-mid', p.borderMid); set('--nav-bg', p.nav);
      set('--text', l.text); set('--text-mid', l.mid); set('--text-dim', l.dim);
      set('--success-bg', l.status.sBg); set('--success-border', l.status.sBorder); set('--success', l.status.success); set('--error', l.status.error);
    }
  }
  function applyTerm() {
    var lightTerm = (state.theme === 'light' && state.term === 'light');
    if (lightTerm) {
      root.style.setProperty('--term-bg', '#FFFFFF');
      root.style.setProperty('--term-bar', '#F2EFE8');
      root.style.setProperty('--term-border', '#E7E1D6');
      root.style.setProperty('--term-dot', '#DAD3C5');
      root.style.setProperty('--term-title', '#8C877C');
      root.style.setProperty('--t-comment', '#9AA093');
      root.style.setProperty('--t-keyword', '#1D6FB8');
      root.style.setProperty('--t-fn', '#0F8A4F');
      root.style.setProperty('--t-str', getComputedStyle(root).getPropertyValue('--burn-text').trim());
      root.style.setProperty('--t-num', '#C026A8');
      root.style.setProperty('--t-output', '#6B6F69');
      root.style.setProperty('--t-success', '#15803D');
      root.style.setProperty('--t-error', '#DC2626');
      root.style.setProperty('--t-burn', getComputedStyle(root).getPropertyValue('--burn').trim());
      document.querySelectorAll('.terminal-body').forEach(function (b) { b.style.color = '#2A2E2C'; });
      document.querySelectorAll('.t-white').forEach(function (w) { w.style.color = '#151514'; });
    } else {
      root.style.setProperty('--term-bg', '#14181A');
      root.style.setProperty('--term-bar', '#1A2022');
      root.style.setProperty('--term-border', '#272E2F');
      root.style.setProperty('--term-dot', '#323A3B');
      root.style.setProperty('--term-title', '#7E8584');
      root.style.setProperty('--t-comment', '#6B7271');
      root.style.setProperty('--t-keyword', '#7DD3FC');
      root.style.setProperty('--t-fn', '#86EFAC');
      root.style.setProperty('--t-str', '#FF7A4D');
      root.style.setProperty('--t-num', '#F9A8D4');
      root.style.setProperty('--t-output', '#9AA0A0');
      root.style.setProperty('--t-success', '#4ADE80');
      root.style.setProperty('--t-error', '#F87171');
      root.style.setProperty('--t-burn', '#FF8A5C');
      document.querySelectorAll('.terminal-body').forEach(function (b) { b.style.color = '#D6D9D8'; });
      document.querySelectorAll('.t-white').forEach(function (w) { w.style.color = '#EAEDEC'; });
    }
  }
  function applyAll() {
    root.setAttribute('data-theme', state.theme);
    applyAccent(state.accent);
    applySurfaces();
    applyTerm();
  }
  function persist() { try { localStorage.setItem('bm-light-tweaks', JSON.stringify(state)); } catch (e) {} }

  // Build accent swatches
  var accentWrap = document.getElementById('tw-accent');
  ACCENTS.forEach(function (a) {
    var b = document.createElement('button');
    b.className = 'tw-sw';
    b.style.background = a.burn;
    b.setAttribute('data-v', a.id);
    b.title = a.id;
    accentWrap.appendChild(b);
  });

  function syncActive() {
    document.querySelectorAll('#tw-accent .tw-sw').forEach(function (b) {
      b.setAttribute('data-active', b.getAttribute('data-v') === state.accent ? '1' : '0');
    });
    document.querySelectorAll('#tw-theme button').forEach(function (b) {
      b.setAttribute('data-active', b.getAttribute('data-v') === state.theme ? '1' : '0');
    });
    document.querySelectorAll('#tw-paper button').forEach(function (b) {
      b.setAttribute('data-active', b.getAttribute('data-v') === state.paper ? '1' : '0');
    });
    document.querySelectorAll('#tw-term button').forEach(function (b) {
      b.setAttribute('data-active', b.getAttribute('data-v') === state.term ? '1' : '0');
    });
  }

  accentWrap.addEventListener('click', function (e) {
    var b = e.target.closest('.tw-sw'); if (!b) return;
    state.accent = b.getAttribute('data-v'); applyAll(); syncActive(); persist();
  });
  function setTheme(next) {
    state.theme = next; applyAll(); syncActive(); persist();
  }
  document.getElementById('tw-theme').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    setTheme(b.getAttribute('data-v'));
  });
  document.getElementById('tw-paper').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.paper = b.getAttribute('data-v'); applyAll(); syncActive(); persist();
  });
  document.getElementById('tw-term').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    state.term = b.getAttribute('data-v'); applyTerm(); syncActive(); persist();
  });

  /* ---- Nav theme toggle button ---- */
  document.getElementById('theme-toggle').addEventListener('click', function () {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  applyAll();
  syncActive();

  /* ---- Host (toolbar) protocol ---- */
  document.getElementById('tw-close').addEventListener('click', function () {
    panel.classList.remove('open');
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  });
  window.addEventListener('message', function (e) {
    var t = e && e.data && e.data.type;
    if (t === '__activate_edit_mode') panel.classList.add('open');
    else if (t === '__deactivate_edit_mode') panel.classList.remove('open');
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
})();
