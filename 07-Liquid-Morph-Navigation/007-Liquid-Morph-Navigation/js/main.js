/* Entry point */
(function () {
  $$('symbol path').forEach(p => p.setAttribute('pathLength', '1')); // enables stroke-draw animations
  initThemeToggle();
  initNavigation();
  handleKeyboardNavigation();
  initMobileNavigation();
  handleMagneticHover();
  handleCursorGlow();
  const dlg = $('#search');
  $('#searchBtn').addEventListener('click', () => dlg.showModal());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
})();
