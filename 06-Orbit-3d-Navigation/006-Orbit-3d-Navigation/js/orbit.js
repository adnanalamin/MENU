(function (O) {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const orbit = {
    angle: -90, raf: 0, last: 0, running: false, paused: false, items: [], root: null, R: 108,
    init() {
      this.root = document.getElementById('orbit');
      if (!this.root) return;
      this.items = Array.from(this.root.querySelectorAll('.orbit__icon'));
      this.cap = document.getElementById('orbit-cap');
      this.layout();
      const pause = (v) => () => { this.paused = v; };
      this.root.addEventListener('pointerenter', pause(true));
      this.root.addEventListener('pointerleave', () => { if (!this.root.contains(document.activeElement)) this.paused = false; });
      this.root.addEventListener('focusin', pause(true));
      this.root.addEventListener('focusout', () => { this.paused = false; });
      this.root.addEventListener('click', (e) => {
        const b = e.target.closest('.orbit__icon');
        if (b) this.select(b);
      });
      this.root.addEventListener('keydown', (e) => {
        const i = this.items.indexOf(document.activeElement);
        if (i < 0) return;
        const n = this.items.length;
        let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
        else if (e.key === 'Home') j = 0;
        else if (e.key === 'End') j = n - 1;
        if (j !== null) { e.preventDefault(); this.items[j].focus(); }
      });
    },
    select(btn) {
      this.items.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const d = btn.dataset;
      this.cap.textContent = '';
      const s = document.createElement('strong'); s.textContent = d.title;
      const p = document.createElement('span'); p.textContent = d.desc;
      const a = document.createElement('a'); a.href = d.href; a.textContent = 'Explore ' + d.title;
      a.addEventListener('click', () => O.nav && O.nav.close());
      this.cap.append(s, p, a);
    },
    layout() {
      const step = 360 / this.items.length;
      this.items.forEach((el, i) => {
        const a = (this.angle + i * step) * Math.PI / 180;
        el.style.transform = 'translate(' + (Math.cos(a) * this.R).toFixed(2) + 'px,' + (Math.sin(a) * this.R).toFixed(2) + 'px)';
      });
    },
    frame(t) {
      if (!this.running) return;
      const dt = Math.min((t - this.last) / 1000, 0.05);
      this.last = t;
      if (!this.paused && !reduce.matches) { this.angle = (this.angle + dt * 16) % 360; this.layout(); }
      this.raf = requestAnimationFrame((x) => this.frame(x));
    },
    start() {
      if (!this.root || this.running) return;
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame((x) => this.frame(x));
    },
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
  };
  O.orbit = orbit;
})(window.ORBIT = window.ORBIT || {});
