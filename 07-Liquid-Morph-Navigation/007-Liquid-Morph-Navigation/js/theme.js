/* Liquid Dark / Liquid Light, persisted in localStorage */
function initThemeToggle() {
  const root = document.documentElement, btns = $$('.theme-btn');
  const apply = t => {
    root.dataset.theme = t;
    btns.forEach(b => {
      b.setAttribute('aria-pressed', String(t === 'light'));
      b.setAttribute('aria-label', 'Switch to ' + (t === 'light' ? 'dark' : 'light') + ' theme');
    });
  };
  apply(root.dataset.theme === 'light' ? 'light' : 'dark');
  btns.forEach(b => b.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem('flux-theme', next); } catch (e) { /* storage blocked */ }
  }));
}
