# Glassmorphism Dropdown

A premium dark-glass navigation bar with two dropdowns, a Resources mega menu, a dedicated mobile accordion menu and a saved dark/light theme. It is one self-contained component built with plain HTML, CSS and JavaScript, with no framework, no build step and no backend.

## Features

- Glassmorphism: translucent panels, `backdrop-filter` blur, luminous borders and soft shadows over an animated ambient background
- Responsive: floating bar on desktop, hamburger with slide-down accordion below 880px
- Dark/Light mode: dark is the default, and the choice is stored in `localStorage`
- Keyboard accessible: Tab, Enter, Space, arrow keys, Home/End and Escape, with visible focus and focus returned to the trigger
- Animated dropdown: fade, rise, scale and blur-in with a staggered item entrance
- Mobile navigation: touch-sized targets and smooth accordion sections
- Mega menu: three link columns plus a featured card
- Custom SVG icons: 30 inline icons in a single sprite, no icon library
- Highlights the nav item for the section you are scrolling through
- Respects `prefers-reduced-motion`, and falls back to near-opaque panels without `backdrop-filter`

## Technologies

- HTML5
- CSS3 (custom properties, grid, `backdrop-filter`)
- Vanilla JavaScript (ES6+)

## Project Structure

```text
glassmorphism-dropdown/
├── index.html          Markup, SVG icon sprite and demo page content
├── css/
│   └── style.css       Tokens, glass styles, mobile-first layout, desktop overrides
├── js/
│   └── script.js       Dropdown state, keyboard support, mobile menu, theme, scroll spy
├── assets/
│   └── icons/
│       └── logo.svg    Favicon / brand mark
└── README.md
```

## How to Run

No install is needed. Open `index.html` in a browser by double-clicking it.

If you prefer a local server:

```bash
cd glassmorphism-dropdown
python3 -m http.server 8000
# then open http://localhost:8000
```

## Customization

All visual settings live in the `:root` block at the top of `css/style.css`. Light-theme overrides sit in `:root[data-theme="light"]` just below it.

| What | Where |
| --- | --- |
| Brand name | `index.html`: the text inside `.brand__name` (and the `aria-label` on `.brand`). Change the mark in `.brand__mark` in CSS, or swap in your own SVG |
| Colors | `--accent-primary`, `--accent-secondary`, `--btn-from`, `--btn-to`, `--text-*`, `--bg-*` and the `--blob-*` colors |
| Glass opacity | `--glass-bg-nav` (bar), `--glass-bg-elevated` (dropdowns) and `--glass-bg` (cards). Lower the alpha for more see-through glass |
| Blur amount | `--blur-nav` and `--blur-panel` |
| Border radius | `--radius-lg` (bar, panels), `--radius-md` (items, buttons), `--radius-sm` |
| Animation speed | `--dur` (panels, 260ms) and `--dur-fast` (hovers, 180ms). Stagger spacing is the `35ms` multiplier in `.nav-item.is-open .stagger` |
| Typography | `--font-sans`. Add a web font with a `<link>` in `index.html` and put its name first |
| Dropdown content | Each item is one `<li>` with a `.menu-item` link (icon, title, description). Copy an existing `<li>`, set a new `--i` stagger index, and point `href` where you need |
| New icons | Add a `<symbol id="i-name" viewBox="0 0 24 24">` to the sprite in `index.html` and use `<svg class="icon"><use href="#i-name"/></svg>` |
| Mobile breakpoint | `880px` appears in `css/style.css` (`min-width: 881px` blocks) and in `CONFIG.mobileQuery` in `js/script.js`. Change both together |

To add another dropdown, copy an existing `<li class="nav-item" data-dropdown>` block and give the button and panel unique `id`, `aria-controls` and `aria-labelledby` values. The script discovers it automatically.

## Browser Support

- Google Chrome and Microsoft Edge (current versions)
- Firefox 103 and later
- Safari 14.1 and later (uses the `-webkit-backdrop-filter` prefix)

Browsers without `backdrop-filter` get near-opaque panels, so text stays readable and every feature still works.

## Notes on the design

- The bar's glass is drawn by a `::before` layer instead of on `.navbar` itself. A parent with its own `backdrop-filter` stops child panels from blurring the page behind them, and this keeps the dropdowns genuinely see-through.
- Hover opens a menu and a click pins it open, so the pointer can move between the link and the panel without flicker, and keyboard and touch users never depend on hover.
