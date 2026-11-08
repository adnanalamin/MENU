(function (O) {
  'use strict';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const $ = (s) => document.querySelector(s);

  function pointerFx() {
    if (!fine.matches) return;
    const rig = $('.rig');
    const mags = Array.from(document.querySelectorAll('[data-magnetic]'));
    let mx = innerWidth / 2, my = innerHeight / 3, raf = 0;
    const apply = () => {
      raf = 0;
      root.style.setProperty('--mx', mx + 'px');
      root.style.setProperty('--my', my + 'px');
      if (!reduce.matches) {
        if (rig) {
          rig.style.setProperty('--ry', ((mx / innerWidth - 0.5) * 40 + 20).toFixed(1) + 'deg');
          rig.style.setProperty('--rx', (-(my / innerHeight - 0.5) * 24 - 14).toFixed(1) + 'deg');
        }
        mags.forEach((el) => {
          if (el.offsetParent === null) return;
          const r = el.getBoundingClientRect();
          const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
          const near = Math.hypot(dx, dy) < 90;
          el.style.translate = near ? (dx * 0.22).toFixed(1) + 'px ' + (dy * 0.3).toFixed(1) + 'px' : '';
        });
        if (O.nav && O.nav.active) {
          const body = $('#panel-' + O.nav.active + ' .panel__body');
          const r = body.getBoundingClientRect();
          const nx = Math.max(-1, Math.min(1, (mx - r.left - r.width / 2) / (r.width / 2 + 120)));
          const ny = Math.max(-1, Math.min(1, (my - r.top - r.height / 2) / (r.height / 2 + 120)));
          body.style.setProperty('--tx', (nx * 4).toFixed(2) + 'deg');
          body.style.setProperty('--ty', (-ny * 3).toFixed(2) + 'deg');
        }
      }
    };
    const reset = () => {
      mags.forEach((el) => { el.style.translate = ''; });
      if (rig) { rig.style.removeProperty('--rx'); rig.style.removeProperty('--ry'); }
      document.querySelectorAll('.panel__body').forEach((b) => { b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); });
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
  }

  function particles() {
    const c = $('#particles');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w = 0, h = 0, raf = 0, ps = [];
    const size = () => {
      w = c.width = innerWidth; h = c.height = innerHeight;
      const n = Math.min(70, Math.round(w * h / 28000));
      ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + 0.4, vx: (Math.random() - 0.5) * 0.18, vy: -Math.random() * 0.25 - 0.05, c: Math.random() > 0.5 ? '34,229,255' : '139,92,246' }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        if (!reduce.matches) { p.x += p.vx; p.y += p.vy; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; } if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4; }
        ctx.fillStyle = 'rgba(' + p.c + ',.7)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      if (!reduce.matches && !document.hidden) raf = requestAnimationFrame(draw);
    };
    size(); draw();
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { cancelAnimationFrame(raf); size(); draw(); }, 150); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { cancelAnimationFrame(raf); draw(); } });
  }

  function scrollFx() {
    const items = document.querySelectorAll('.reveal');
    const counters = document.querySelectorAll('[data-count]');
    const count = (el) => {
      const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
      if (reduce.matches) { el.textContent = end.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }); return; }
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min((t - t0) / 1400, 1), v = end * (1 - Math.pow(1 - k, 3));
        el.textContent = v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) { items.forEach((i) => i.classList.add('in')); counters.forEach(count); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const n = e.target.querySelector('[data-count]');
      if (n) count(n);
      io.unobserve(e.target);
    }), { threshold: 0.25 });
    items.forEach((i, k) => { i.style.transitionDelay = (k % 4) * 70 + 'ms'; io.observe(i); });
  }

  O.fx = { init() { pointerFx(); particles(); scrollFx(); } };
})(window.ORBIT = window.ORBIT || {});
