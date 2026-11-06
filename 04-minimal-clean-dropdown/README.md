# Minimal Clean Dropdown

A premium, minimalist dropdown navigation built with **HTML5, CSS3 and vanilla JavaScript (ES6+)**. No frameworks, no external icon libraries, no build step.

## Project structure

```
minimal-clean-dropdown/
├── index.html          Page markup, inline SVG icon sprite, demo sections
├── README.md
├── css/style.css       Tokens, layout, dropdown, mobile accordion, dark theme
├── js/script.js        Dropdown state, mobile menu, keyboard, theme, scroll spy
└── assets/icons/       logo.svg (favicon). Menu icons live in the sprite in index.html
```

## Run locally

No install needed. Either double-click `index.html`, or serve the folder:

```bash
cd minimal-clean-dropdown
python3 -m http.server 8000     # then open http://localhost:8000
```

## Features

- Dropdowns open on hover **and** click; close on outside click, Escape, or focus leaving
- Only one dropdown open at a time; a short close delay plus a hover "bridge" prevents flicker
- Fade + slide + scale animation (180–300 ms), rotating chevron, underline and button hover effects
- Sticky, blurred header with active-section indicator (IntersectionObserver)
- Mobile (≤ 900px): hamburger, slide-down panel, accordion dropdowns, 44–48px touch targets
- Light theme with optional dark mode (remembers choice, respects system setting)
- Accessibility: semantic `header/nav/main`, `aria-expanded`, `aria-controls`, skip link, visible focus rings, Enter/Space on triggers, ArrowDown/ArrowUp/Home/End inside menus, Escape to close, `prefers-reduced-motion` support

## Customize

All design values are CSS variables at the top of `css/style.css`.

| What | Where |
|---|---|
| Colors | `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--color-text`, `--color-bg` (dark values under `[data-theme="dark"]`) |
| Font | `--font-sans` (add a `<link>` for a web font if you want one) |
| Spacing / size | `--nav-height`, `--container`, `--gutter` |
| Corners and shadows | `--radius-sm/md/lg/pill`, `--shadow-sm`, `--shadow-lg` |
| Animation speed | `--dur-fast` (180ms), `--dur` (240ms), `--dur-slow` (300ms), `--ease` |
| Dropdown width | `.dropdown { width: 22rem }` |
| Mobile breakpoint | `900px` in the CSS media query **and** `(min-width: 901px)` at the top of `script.js` |
| Hover forgiveness | `HOVER_CLOSE_DELAY` in `script.js` |

**Add a menu item:** copy a `<li>` inside `.dropdown-list` and change the icon (`<use href="#i-...">`), title and description.
**Add an icon:** add a `<symbol id="i-name" viewBox="0 0 24 24">` to the sprite in `index.html`.
**Add a dropdown:** copy a `.has-dropdown` block, give the button and panel a new matching `aria-controls`/`id`. The script picks it up automatically.
**Active indicator:** give a link `data-section="id"` matching a `<section id="id">`.

## Manual test checklist

Hover and click both dropdowns · open one then the other (only one stays open) · click outside · Escape returns focus to the trigger · Tab, ArrowDown, ArrowUp, Home, End · hamburger and accordion at 375px and 320px · no horizontal scroll at 320, 375, 768, 1024, 1440px · dark toggle · console shows no errors.
