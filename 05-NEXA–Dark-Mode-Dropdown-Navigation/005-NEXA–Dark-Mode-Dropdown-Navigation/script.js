(() => {
  'use strict';

  /* ---------- DOM selection ---------- */
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menu-btn');
  const navList = document.getElementById('nav-list');
  const themeBtn = document.getElementById('theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const items = [...document.querySelectorAll('.has-dd')];

  const STORAGE_KEY = 'nexa-theme';
  const mobileQuery = window.matchMedia('(max-width: 767.98px)');
  const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
  const isMobile = () => mobileQuery.matches;

  const triggerOf = (li) => li.querySelector('.dd-trigger');
  const panelOf = (li) => li.querySelector('.dd');
  const isOpen = (li) => li.classList.contains('is-open');
  const linksOf = (li) => [...panelOf(li).querySelectorAll('a[href]')];

  /* ---------- Theme manager ---------- */
  const getSavedTheme = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch { return null; }
  };

  // Priority: saved preference -> system preference -> dark
  const getInitialTheme = () => getSavedTheme() ?? (lightQuery.matches ? 'light' : 'dark');

  const setTheme = (theme, { persist = false, animate = false } = {}) => {
    if (animate) {
      root.classList.add('theme-anim');
      setTimeout(() => root.classList.remove('theme-anim'), 450);
    }
    root.dataset.theme = theme;
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#050505' : '#f7f8fb';
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* storage unavailable */ }
    }
  };

  const toggleTheme = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', { persist: true, animate: true });

  /* ---------- Dropdown manager ---------- */
  const pinned = new WeakSet();   // opened by click/keyboard (stays open until dismissed)
  const hoverTimers = new WeakMap();

  const openDropdown = (li) => {
    closeAllDropdowns(li);
    li.classList.add('is-open');
    triggerOf(li).setAttribute('aria-expanded', 'true');
  };

  const closeDropdown = (li) => {
    li.classList.remove('is-open');
    triggerOf(li).setAttribute('aria-expanded', 'false');
    pinned.delete(li);
  };

  const closeAllDropdowns = (except = null) => {
    items.forEach((li) => { if (li !== except && isOpen(li)) closeDropdown(li); });
  };

  const toggleDropdown = (li) => {
    if (isOpen(li)) closeDropdown(li);
    else { openDropdown(li); pinned.add(li); }
  };

  /* ---------- Mobile navigation ---------- */
  const toggleMobileMenu = (force) => {
    const open = force ?? !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) closeAllDropdowns();
  };

  const closeMobileMenu = (returnFocus = false) => {
    if (!header.classList.contains('menu-open')) return;
    toggleMobileMenu(false);
    if (returnFocus) menuBtn.focus();
  };

  /* ---------- Accordion manager (mobile) ---------- */
  const toggleAccordion = (li) => {
    if (isOpen(li)) closeDropdown(li);
    else openDropdown(li); // closes any other section first
  };

  /* ---------- Keyboard navigation ---------- */
  const focusLink = (li, index) => {
    const links = linksOf(li);
    if (links.length) links[(index + links.length) % links.length].focus();
  };

  const handleKeyboardNavigation = (e) => {
    const li = e.target.closest('.has-dd');
    if (!li) return;
    const onTrigger = e.target === triggerOf(li);
    const links = linksOf(li);
    const current = links.indexOf(document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (onTrigger) { if (!isOpen(li)) { openDropdown(li); pinned.add(li); } focusLink(li, 0); }
        else focusLink(li, current + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (onTrigger) { if (!isOpen(li)) { openDropdown(li); pinned.add(li); } focusLink(li, -1); }
        else focusLink(li, current - 1);
        break;
      case 'Home': if (!onTrigger && isOpen(li)) { e.preventDefault(); focusLink(li, 0); } break;
      case 'End': if (!onTrigger && isOpen(li)) { e.preventDefault(); focusLink(li, -1); } break;
      default:
    }
  };

  /* ---------- Escape key ---------- */
  const handleEscape = (e) => {
    if (e.key !== 'Escape') return;
    const open = items.find(isOpen);
    if (open) {
      const hadFocusInside = open.contains(document.activeElement);
      closeDropdown(open);
      if (hadFocusInside) triggerOf(open).focus();
      if (!isMobile() || !header.classList.contains('menu-open')) return;
    }
    if (isMobile() && header.classList.contains('menu-open')) closeMobileMenu(true);
  };

  /* ---------- Outside click ---------- */
  const handleOutsideClick = (e) => {
    if (!e.target.closest('.has-dd')) closeAllDropdowns();
    if (isMobile() && !e.target.closest('.nav')) closeMobileMenu();
  };

  /* ---------- Wiring ---------- */
  themeBtn.addEventListener('click', toggleTheme);
  menuBtn.addEventListener('click', () => toggleMobileMenu());

  items.forEach((li) => {
    const trigger = triggerOf(li);

    trigger.addEventListener('click', () => {
      if (isMobile()) return toggleAccordion(li);
      if (isOpen(li) && !pinned.has(li)) { pinned.add(li); return; } // hover-opened: pin it
      toggleDropdown(li);
    });

    // Hover (mouse only, desktop). Click/keyboard always work too.
    li.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || isMobile()) return;
      clearTimeout(hoverTimers.get(li));
      if (!isOpen(li)) openDropdown(li);
    });
    li.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse' || isMobile() || pinned.has(li)) return;
      hoverTimers.set(li, setTimeout(() => closeDropdown(li), 160));
    });

    // Close when keyboard focus tabs out of an open desktop dropdown
    li.addEventListener('focusout', (e) => {
      if (!isMobile() && e.relatedTarget && !li.contains(e.relatedTarget)) closeDropdown(li);
    });
  });

  // Choosing a link closes menus
  navList.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) { closeAllDropdowns(); closeMobileMenu(); }
  });

  header.addEventListener('keydown', handleKeyboardNavigation);
  document.addEventListener('keydown', handleEscape);
  document.addEventListener('click', handleOutsideClick);

  // Resize handler: reset state when crossing the mobile breakpoint
  mobileQuery.addEventListener('change', () => { closeAllDropdowns(); toggleMobileMenu(false); });

  // Follow system theme changes only when the user has no saved choice
  lightQuery.addEventListener('change', () => { if (!getSavedTheme()) setTheme(getInitialTheme()); });

  setTheme(getInitialTheme());
})();
