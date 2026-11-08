# Dark Mode Dropdown

A premium dark-mode navigation component with subtle neon glow, animated dropdowns, a resources mega menu, a complete light theme and an accessible mobile menu. Built with plain HTML, CSS and JavaScript, with no frameworks or external assets.

## Features

- Dark theme (default) and a full light theme
- Theme persistence via `localStorage`, with `prefers-color-scheme` fallback (saved choice, then system, then dark)
- Glowing hover and active states
- Dropdown animation (fade, slide, scale) with a slow travelling border glow
- Services, Products and Resources mega menu
- Mobile hamburger menu with accordion sections
- Keyboard navigation: Tab, Enter, Space, Escape, Arrow Up/Down, Home/End
- Accessibility: semantic markup, `aria-expanded`, `aria-controls`, `aria-haspopup`, visible focus
- Responsive from 320px up, reduced-motion support

## Technologies

- HTML5
- CSS3 (custom properties, grid, `@property`)
- Vanilla JavaScript (ES6+)

## Installation

No build step. Open `index.html` in a modern browser, or serve the folder:

```bash
python3 -m http.server 8000
```

```text
dark-mode-dropdown/
├── index.html
├── css/style.css
├── js/script.js
├── assets/icons/favicon.svg
└── README.md
```

## Customization

All design tokens live at the top of `css/style.css`. Light theme overrides sit under `[data-theme="light"]`.

| To change | Edit |
| --- | --- |
| Logo | The `#i-logo` symbol in the SVG sprite in `index.html` (and `assets/icons/favicon.svg`) |
| Brand name | The `NEXA` text in `.brand` |
| Navigation items | The `<li>` entries inside `#nav-list`; new dropdowns need `.has-dd`, a `.dd-trigger` button and a matching `aria-controls` id |
| Colors | `--accent-primary-rgb`, `--accent-secondary-rgb`, `--bg-*`, `--text-*`, `--border` |
| Glow intensity | `--glow-strength` (`0` turns glows off, `1` is default, `1.5` is stronger) |
| Border radius | `--radius-sm`, `--radius-md`, `--radius-lg` |
| Shadows | `--shadow-sm`, `--shadow-lg` |
| Animation speed | `--transition-fast`, `--transition-normal`; border glow speed is the `8s` in `.dd::before` |
| Typography | `--font` |
| Dropdown content | `.dd-item` blocks (icon, title, description) or `.mega` columns; each dropdown's accent is set by `--dd-rgb` (see `.dd-products`) |
| Mobile breakpoint | `767.98px` in `style.css` and `mobileQuery` in `script.js` |
