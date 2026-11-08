/* Desktop dropdowns, shared morphing panel, keyboard + mobile menu */
const Nav = { open: null, pinned: false, timer: 0 };
const RADII = {
  services: '38px 30px 42px 32px / 32px 40px 30px 38px',
  products: '28px 42px 28px 42px / 42px 28px 42px 28px',
  resources: '44px 28px 38px 34px / 30px 42px 28px 40px'
};
const canHover = () => matchMedia('(hover: hover) and (min-width: 768px)').matches;
const isDesktop = () => matchMedia('(min-width: 768px)').matches;
const restingItem = () => (Nav.open && $(`[data-menu="${Nav.open}"]`)) || Nav.current;

function initNavigation() {
  Nav.wrap = $('#navWrap'); Nav.panel = $('#panel'); Nav.links = $('#links');
  Nav.items = $$('.nl', Nav.links);
  Nav.triggers = $$('[data-menu]');
  Nav.current = $('.nl[aria-current]');

  Nav.items.forEach(el => {
    el.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch' || !canHover()) return;
      updateActiveIndicator(el);
      if (el.dataset.menu) openDropdown(el.dataset.menu); else scheduleClose(120);
    });
    el.addEventListener('focus', () => updateActiveIndicator(el));
  });
  Nav.links.addEventListener('pointerleave', () => updateActiveIndicator(restingItem()));

  // Click pins a dropdown open (so hover-open + click never flickers shut)
  Nav.triggers.forEach(b => b.addEventListener('click', e => {
    const id = b.dataset.menu;
    if (Nav.open === id && Nav.pinned) { closeDropdown(); return; }
    openDropdown(id); Nav.pinned = true;
    if (e.detail === 0) focusPane(id); // keyboard activation
  }));

  Nav.wrap.addEventListener('pointerenter', () => clearTimeout(Nav.timer));
  Nav.wrap.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && !Nav.pinned) scheduleClose(160); });
  Nav.wrap.addEventListener('focusout', e => {
    if (Nav.open && e.relatedTarget && !Nav.wrap.contains(e.relatedTarget)) closeDropdown();
  });
  document.addEventListener('pointerdown', e => { if (Nav.open && !Nav.wrap.contains(e.target)) closeDropdown(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && Nav.open) {
      const t = $(`[data-menu="${Nav.open}"]`); closeDropdown(); t.focus();
    }
  });
  addEventListener('resize', () => {
    if (Nav.open) { isDesktop() ? positionPanel(Nav.open) : closeDropdown(); }
    updateActiveIndicator(restingItem());
  });
  updateActiveIndicator(Nav.current);
  if (document.fonts) document.fonts.ready.then(() => updateActiveIndicator(restingItem()));
}

function scheduleClose(ms) {
  clearTimeout(Nav.timer);
  Nav.timer = setTimeout(() => { if (!Nav.pinned) closeDropdown(); }, ms);
}

/* Size, place and theme the shared panel for one pane. */
function positionPanel(id) {
  const pane = $(`[data-pane="${id}"]`), btn = $(`[data-menu="${id}"]`), p = Nav.panel;
  $$('.pane').forEach(el => { const on = el === pane; el.classList.toggle('on', on); el.inert = !on; });
  Nav.triggers.forEach(b => b.setAttribute('aria-expanded', String(b === btn)));
  const w = pane.offsetWidth, h = pane.offsetHeight;
  const hr = Nav.wrap.getBoundingClientRect(), br = btn.getBoundingClientRect();
  const cx = br.left + br.width / 2 - hr.left;
  const x = Math.max(12 - hr.left, Math.min(innerWidth - 12 - w - hr.left, cx - w / 2));
  p.style.setProperty('--x', x + 'px'); p.style.setProperty('--w', w + 'px');
  p.style.setProperty('--h', h + 'px'); p.style.setProperty('--r', RADII[id]);
  p.style.setProperty('--ox', (cx - x) + 'px');
  p.dataset.active = id;
}

function openDropdown(id) {
  clearTimeout(Nav.timer);
  if (Nav.open === id) return;
  if (Nav.open) return switchDropdown(id);
  // First open: place the panel without animating position, then let it grow from the trigger.
  Nav.panel.classList.add('snap');
  positionPanel(id);
  void Nav.panel.offsetWidth;
  Nav.panel.classList.remove('snap');
  Nav.panel.classList.add('open');
  Nav.open = id;
  updateActiveIndicator($(`[data-menu="${id}"]`));
}

/* Panel glides + resizes to the next pane instead of swapping abruptly. */
function switchDropdown(id) {
  positionPanel(id);
  Nav.open = id;
  updateActiveIndicator($(`[data-menu="${id}"]`));
}

function closeDropdown() {
  clearTimeout(Nav.timer);
  Nav.panel.classList.remove('open');
  Nav.triggers.forEach(b => b.setAttribute('aria-expanded', 'false'));
  $$('.pane').forEach(el => { el.classList.remove('on'); el.inert = true; });
  Nav.open = null; Nav.pinned = false;
  updateActiveIndicator(Nav.current);
}

function focusPane(id) {
  requestAnimationFrame(() => { const a = $('a', $(`[data-pane="${id}"]`)); if (a) a.focus(); });
}

/* Arrow keys: left/right across top-level items, down opens, up/down inside a pane. */
function handleKeyboardNavigation() {
  Nav.wrap.addEventListener('keydown', e => {
    const t = e.target;
    if (t.classList.contains('nl')) {
      const i = Nav.items.indexOf(t), n = Nav.items.length;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const next = Nav.items[(i + (e.key === 'ArrowRight' ? 1 : -1) + n) % n];
        next.focus();
        if (Nav.open) { next.dataset.menu ? openDropdown(next.dataset.menu) : closeDropdown(); }
      } else if (e.key === 'ArrowDown' && t.dataset.menu) {
        e.preventDefault(); openDropdown(t.dataset.menu); Nav.pinned = true; focusPane(t.dataset.menu);
      }
    } else if (t.closest('.pane')) {
      const f = $$('a', t.closest('.pane')), i = f.indexOf(t);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); f[(i + 1) % f.length].focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); f[(i - 1 + f.length) % f.length].focus(); }
    }
  });
}

/* Full-screen mobile menu with single-open accordions and scroll lock. */
function initMobileNavigation() {
  const m = $('#mobile'), burger = $('#burger'), close = $('#mClose');
  const set = (open, focus = true) => {
    m.classList.toggle('open', open); m.inert = !open; m.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open)); burger.classList.toggle('x', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('lock', open);
    if (open) { closeDropdown(); if (focus) requestAnimationFrame(() => close.focus()); }
    else if (focus) burger.focus();
  };
  burger.addEventListener('click', () => set(!m.classList.contains('open')));
  close.addEventListener('click', () => set(false));
  m.addEventListener('click', e => { if (e.target.closest('a')) set(false, false); });
  $$('.acc-btn', m).forEach(b => b.addEventListener('click', () => {
    const was = b.getAttribute('aria-expanded') === 'true';
    $$('.acc-btn', m).forEach(x => x.setAttribute('aria-expanded', 'false'));
    b.setAttribute('aria-expanded', String(!was));
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) set(false); });
  addEventListener('resize', () => { if (isDesktop() && m.classList.contains('open')) set(false, false); });
}
