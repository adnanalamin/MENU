/* Shared helpers + motion: indicator, magnetic hover, cursor glow */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

/* One shared indicator that slides to any item and adopts its width. */
function updateActiveIndicator(el) {
  const ind = $('.ind');
  if (!ind) return;
  if (!el) { ind.style.opacity = 0; return; }
  const li = el.parentElement;
  ind.style.setProperty('--ix', li.offsetLeft + 'px');
  ind.style.setProperty('--iw', li.offsetWidth + 'px');
  ind.style.opacity = 1;
}

/* Subtle pull of icons / CTA toward the pointer (max ~3px). */
function handleMagneticHover() {
  if (!FINE_POINTER() || REDUCED()) return;
  $$('.nl, .cta').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width;
      const dy = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.setProperty('--mx', (dx * 6).toFixed(2) + 'px');
      el.style.setProperty('--my', (dy * 6).toFixed(2) + 'px');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });
}

/* Ambient glow eased toward the pointer; rAF runs only until it catches up. */
function handleCursorGlow() {
  if (!FINE_POINTER() || REDUCED()) return;
  const root = document.documentElement;
  let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, raf = 0;
  const tick = () => {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    root.style.setProperty('--gx', x.toFixed(1) + 'px');
    root.style.setProperty('--gy', y.toFixed(1) + 'px');
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
  };
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  root.classList.add('has-glow');
  tick();
}
