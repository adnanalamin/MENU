/* ==========================================================================
   NOVA – Glassmorphism Dropdown
   Order of this file:
     1. Config + state
     2. DOM references
     3. Dropdown functions
     4. Mobile menu functions
     5. Keyboard accessibility
     6. Outside-click handling
     7. Escape-key handling
     8. Theme management
     9. Scroll spy (active link)
    10. Resize handling
    11. Init
   Loaded from <head> without defer: the saved theme is applied immediately,
   everything else waits for DOMContentLoaded.
   ========================================================================== */
(() => {
  'use strict';

  /* 1. CONFIG + STATE ---------------------------------------------------- */
  const CONFIG = {
    storageKey: 'nova-theme',
    defaultTheme: 'dark',
    mobileQuery: '(max-width: 880px)',            // keep in sync with css/style.css
    hoverQuery: '(hover: hover) and (pointer: fine)',
    hoverCloseDelay: 160                          // ms grace period before a hover-opened menu closes
  };

  const state = {
    openId: null,      // id of the open dropdown panel, or null
    pinned: false,     // true when opened by click/keyboard (hover must not close it)
    menuOpen: false,   // mobile slide-down menu
    theme: CONFIG.defaultTheme
  };

  let hoverTimer = null;
  const mobileMedia = window.matchMedia(CONFIG.mobileQuery);
  const hoverMedia = window.matchMedia(CONFIG.hoverQuery);

  const isMobile = () => mobileMedia.matches;
  const canHover = () => hoverMedia.matches && !mobileMedia.matches;

  /* 2. DOM REFERENCES (filled in init) ----------------------------------- */
  const dom = {};
  let dropdowns = []; // [{ id, item, trigger, panel, links }]

  const getDropdown = (id) => dropdowns.find((entry) => entry.id === id) || null;

  /* 3. DROPDOWN FUNCTIONS ------------------------------------------------ */
  function setDropdownVisual(entry, isOpen) {
    entry.item.classList.toggle('is-open', isOpen);
    entry.trigger.setAttribute('aria-expanded', String(isOpen));
  }

  function openDropdown(entry, { pinned = false } = {}) {
    window.clearTimeout(hoverTimer);
    // Only one dropdown open at a time
    dropdowns.forEach((other) => {
      if (other !== entry) setDropdownVisual(other, false);
    });
    setDropdownVisual(entry, true);
    state.openId = entry.id;
    state.pinned = pinned;
  }

  function closeDropdown(entry) {
    window.clearTimeout(hoverTimer);
    setDropdownVisual(entry, false);
    if (state.openId === entry.id) {
      state.openId = null;
      state.pinned = false;
    }
  }

  function closeAllDropdowns() {
    window.clearTimeout(hoverTimer);
    dropdowns.forEach((entry) => setDropdownVisual(entry, false));
    state.openId = null;
    state.pinned = false;
  }

  function toggleDropdown(entry, event) {
    const isOpen = state.openId === entry.id;
    const fromKeyboard = event.detail === 0; // Enter / Space produce click with detail 0
    if (isOpen && (state.pinned || fromKeyboard)) {
      closeDropdown(entry);
    } else {
      // Closed, or only hover-opened: a click pins it open
      openDropdown(entry, { pinned: true });
    }
  }

  function handlePointerEnter(entry, event) {
    if (event.pointerType !== 'mouse' || !canHover()) return;
    window.clearTimeout(hoverTimer);
    openDropdown(entry, { pinned: state.openId === entry.id ? state.pinned : false });
  }

  function handlePointerLeave(entry, event) {
    if (event.pointerType !== 'mouse' || !canHover()) return;
    if (state.openId !== entry.id || state.pinned) return;
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => {
      if (state.openId === entry.id && !state.pinned) closeDropdown(entry);
    }, CONFIG.hoverCloseDelay);
  }

  function handleFocusOut(entry, event) {
    // Tabbing out of the dropdown's wrapper closes it
    if (event.relatedTarget && !entry.item.contains(event.relatedTarget)) {
      closeDropdown(entry);
    }
  }

  /* 4. MOBILE MENU FUNCTIONS --------------------------------------------- */
  function openMobileMenu() {
    state.menuOpen = true;
    dom.navbar.classList.add('is-menu-open');
    dom.menuToggle.setAttribute('aria-expanded', 'true');
    dom.menuToggle.setAttribute('aria-label', 'Close menu');
  }

  function closeMobileMenu() {
    state.menuOpen = false;
    dom.navbar.classList.remove('is-menu-open');
    dom.menuToggle.setAttribute('aria-expanded', 'false');
    dom.menuToggle.setAttribute('aria-label', 'Open menu');
    closeAllDropdowns();
  }

  function toggleMobileMenu() {
    if (state.menuOpen) closeMobileMenu();
    else openMobileMenu();
  }

  /* 5. KEYBOARD ACCESSIBILITY -------------------------------------------- */
  function focusLink(entry, which) {
    const { links } = entry;
    if (!links.length) return;
    const target = which === 'last' ? links[links.length - 1] : links[0];
    target.focus();
  }

  function handleKeyboardNavigation(event) {
    const { key } = event;
    const active = document.activeElement;

    // (a) Focus is inside a dropdown panel: arrows / Home / End move between links
    const panelEntry = dropdowns.find((entry) => entry.panel.contains(active));
    if (panelEntry) {
      const index = panelEntry.links.indexOf(active);
      const last = panelEntry.links.length - 1;
      let next = null;
      if (key === 'ArrowDown') next = index >= last ? 0 : index + 1;
      else if (key === 'ArrowUp') next = index <= 0 ? last : index - 1;
      else if (key === 'Home') next = 0;
      else if (key === 'End') next = last;
      if (next !== null) {
        event.preventDefault();
        panelEntry.links[next].focus();
      }
      return;
    }

    // (b) Focus is on a dropdown trigger: ArrowDown / ArrowUp open and enter the panel
    const triggerEntry = dropdowns.find((entry) => entry.trigger === active);
    if (triggerEntry && (key === 'ArrowDown' || key === 'ArrowUp')) {
      event.preventDefault();
      openDropdown(triggerEntry, { pinned: true });
      focusLink(triggerEntry, key === 'ArrowUp' ? 'last' : 'first');
      return;
    }

    // (c) Desktop top level: Left / Right move between nav controls
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && !isMobile() && dom.topControls.includes(active)) {
      event.preventDefault();
      const step = key === 'ArrowRight' ? 1 : -1;
      const count = dom.topControls.length;
      const index = dom.topControls.indexOf(active);
      dom.topControls[(index + step + count) % count].focus();
    }
  }

  /* 6. OUTSIDE-CLICK HANDLING -------------------------------------------- */
  function handleOutsideClick(event) {
    const { target } = event;
    const openEntry = getDropdown(state.openId);
    if (openEntry && !openEntry.item.contains(target)) closeAllDropdowns();
    if (state.menuOpen && !dom.navbar.contains(target)) closeMobileMenu();
  }

  // Following any link in the bar (including inside dropdowns) closes everything
  function handleLinkActivation(event) {
    if (!event.target.closest('a[href]')) return;
    if (state.menuOpen) closeMobileMenu();
    else closeAllDropdowns();
  }

  /* 7. ESCAPE-KEY HANDLING ----------------------------------------------- */
  function handleEscape(event) {
    if (event.key !== 'Escape') return;

    const openEntry = getDropdown(state.openId);
    if (openEntry) {
      const focusInside = openEntry.item.contains(document.activeElement);
      closeAllDropdowns();
      if (focusInside) openEntry.trigger.focus();
    }

    if (state.menuOpen && isMobile()) {
      const focusInside = dom.navbar.contains(document.activeElement);
      closeMobileMenu();
      if (focusInside) dom.menuToggle.focus();
    }
  }

  /* 8. THEME MANAGEMENT -------------------------------------------------- */
  function readStoredTheme() {
    try {
      const stored = window.localStorage.getItem(CONFIG.storageKey);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch (error) {
      return null; // storage blocked (private mode, file:// restrictions)
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(CONFIG.storageKey, theme);
    } catch (error) {
      /* ignore: the theme still applies for this visit */
    }
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#070a1a' : '#eef1ff');
    if (dom.themeToggle) {
      dom.themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  function toggleTheme() {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  }

  /* 9. SCROLL SPY (marks the nav item for the section in view) ------------ */
  function setActiveSection(id) {
    dom.sectionControls.forEach((control) => {
      const isActive = control.dataset.section === id;
      control.classList.toggle('is-active', isActive);
      if (control.tagName === 'A') {
        if (isActive) control.setAttribute('aria-current', 'location');
        else control.removeAttribute('aria-current');
      }
    });
  }

  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-20% 0px -75% 0px' });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
  }

  /* 10. RESIZE HANDLING -------------------------------------------------- */
  function handleBreakpointChange() {
    // Layout switched between mobile and desktop: reset so nothing is left half-open
    closeMobileMenu();
    closeAllDropdowns();
  }

  function listenToMedia(mediaQueryList, handler) {
    if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', handler);
    else mediaQueryList.addListener(handler); // older Safari
  }

  /* 11. INIT ------------------------------------------------------------- */
  function init() {
    dom.navbar = document.querySelector('.navbar');
    dom.menuToggle = document.querySelector('.menu-toggle');
    dom.themeToggle = document.querySelector('.theme-toggle');
    dom.navList = document.querySelector('.nav-list');
    dom.sectionControls = [...document.querySelectorAll('[data-section]')];
    dom.topControls = [...dom.navList.querySelectorAll(':scope > .nav-item > .nav-link')];

    dropdowns = [...document.querySelectorAll('[data-dropdown]')].map((item) => {
      const trigger = item.querySelector('.nav-trigger');
      const panel = item.querySelector('.dropdown');
      return { id: panel.id, item, trigger, panel, links: [...panel.querySelectorAll('a[href]')] };
    });

    dropdowns.forEach((entry) => {
      entry.trigger.addEventListener('click', (event) => toggleDropdown(entry, event));
      entry.item.addEventListener('pointerenter', (event) => handlePointerEnter(entry, event));
      entry.item.addEventListener('pointerleave', (event) => handlePointerLeave(entry, event));
      entry.item.addEventListener('focusout', (event) => handleFocusOut(entry, event));
    });

    dom.menuToggle.addEventListener('click', toggleMobileMenu);
    dom.themeToggle.addEventListener('click', toggleTheme);
    dom.navbar.addEventListener('click', handleLinkActivation);
    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyboardNavigation);
    document.addEventListener('keydown', handleEscape);
    listenToMedia(mobileMedia, handleBreakpointChange);
    listenToMedia(hoverMedia, handleBreakpointChange);

    applyTheme(state.theme); // refresh the toggle's label now that it exists
    initScrollSpy();
  }

  /* Apply the saved theme right away (before first paint), then wait for the DOM. */
  applyTheme(readStoredTheme() || CONFIG.defaultTheme);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
