/* ==========================================================================
   Minimal Clean Dropdown – script.js
   Sections: elements · dropdown state · mobile menu · events · theme · scroll
   ========================================================================== */
(() => {
  'use strict';

  // ---- Settings -----------------------------------------------------------
  const DESKTOP = window.matchMedia('(min-width: 901px)'); // keep in sync with CSS breakpoint
  const HOVER_CLOSE_DELAY = 140; // ms the pointer may stray before the menu closes (prevents flicker)

  // ---- Elements -----------------------------------------------------------
  const header = document.querySelector('.site-header');
  const panel = document.getElementById('nav-panel');
  const menuToggle = document.querySelector('.nav-toggle');
  const themeToggle = document.querySelector('.theme-toggle');
  const dropdownItems = [...document.querySelectorAll('.has-dropdown')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionLinks = [...document.querySelectorAll('[data-section]')];

  // ---- Dropdown state: at most one open item at any time ------------------
  let openItem = null;
  let openedByHover = false; // lets a click "pin" a menu that hover opened
  let closeTimer = null;

  const triggerOf = (item) => item.querySelector('.nav-trigger');
  const linksOf = (item) => [...item.querySelectorAll('.dropdown-link')];

  function openDropdown(item, { byHover = false } = {}) {
    clearTimeout(closeTimer);
    if (openItem !== item) {
      closeDropdown();
      item.classList.add('is-open');
      triggerOf(item).setAttribute('aria-expanded', 'true');
      openItem = item;
    }
    openedByHover = byHover;
  }

  function closeDropdown({ restoreFocus = false } = {}) {
    clearTimeout(closeTimer);
    if (!openItem) return;
    const trigger = triggerOf(openItem);
    openItem.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus();
    openItem = null;
    openedByHover = false;
  }

  // ---- Mobile menu --------------------------------------------------------
  const isMenuOpen = () => panel.classList.contains('is-open');

  function setMenu(open) {
    panel.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) closeDropdown();
  }

  // ---- Events (delegated on the header where possible) --------------------
  header.addEventListener('click', (event) => {
    const trigger = event.target.closest('.nav-trigger');
    if (trigger) {
      const item = trigger.closest('.has-dropdown');
      // Toggle, except when hover just opened it on desktop: then keep it open (pinned)
      if (openItem === item && !(DESKTOP.matches && openedByHover)) closeDropdown();
      else openDropdown(item);
      return;
    }
    if (event.target.closest('a[href^="#"]')) { // navigating: tidy up
      closeDropdown();
      if (!DESKTOP.matches) setMenu(false);
    }
  });

  menuToggle.addEventListener('click', () => setMenu(!isMenuOpen()));

  // Hover (mouse only, desktop only). pointerenter/leave do not bubble, so bind per item.
  dropdownItems.forEach((item) => {
    item.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && DESKTOP.matches) openDropdown(item, { byHover: true });
    });
    item.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse' || !DESKTOP.matches || openItem !== item) return;
      closeTimer = setTimeout(closeDropdown, HOVER_CLOSE_DELAY);
    });
  });

  // Click outside closes the dropdown (and the mobile menu)
  document.addEventListener('click', (event) => {
    if (openItem && !openItem.contains(event.target)) closeDropdown();
    if (isMenuOpen() && !header.contains(event.target)) setMenu(false);
  });

  // Keyboard: Escape, arrow keys inside open dropdowns
  document.addEventListener('keydown', (event) => {
    const { key, target } = event;

    if (key === 'Escape') {
      if (openItem) closeDropdown({ restoreFocus: true });
      else if (isMenuOpen()) { setMenu(false); menuToggle.focus(); }
      return;
    }

    const item = target.closest?.('.has-dropdown');
    if (!item) return;
    const links = linksOf(item);
    const index = links.indexOf(target);

    if (target.matches('.nav-trigger') && key === 'ArrowDown') {
      event.preventDefault();
      openDropdown(item);
      links[0].focus(); // visibility is already "visible" once is-open is set
    } else if (index !== -1 && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: links.length - 1 }[key];
      links[(next + links.length) % links.length].focus();
    }
  });

  // Close when keyboard focus moves to another place (ignore null: happens on mouse clicks in some browsers)
  header.addEventListener('focusout', (event) => {
    const item = event.target.closest('.has-dropdown');
    if (item && event.relatedTarget && !item.contains(event.relatedTarget)) {
      if (item === openItem) closeDropdown();
    }
  });

  // Switching between mobile and desktop layouts resets everything
  DESKTOP.addEventListener('change', () => { closeDropdown(); setMenu(false); });

  // ---- Theme (light / dark) ----------------------------------------------
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch { /* storage unavailable */ }
  applyTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch { /* ignore */ }
  });

  // ---- Sticky header shadow + active link (scroll spy) -------------------
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setActive(id) {
    sectionLinks.forEach((link) => {
      const active = link.dataset.section === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  // A section becomes "active" when it crosses the middle of the viewport
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
  setActive('home');
})();
