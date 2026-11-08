# FLUX — Liquid Morph Navigation

A premium animated navigation system in plain HTML, CSS and JavaScript — no frameworks, no libraries, no build step.

## Features
- Floating glass pill navbar with one shared **liquid panel**: it grows from the trigger, changes its organic border radius, glides and resizes between Services / Products / Resources
- Single sliding active indicator (adapts to item width) with a moving underline
- Staggered item entrances, per-card hover effects, stroke-draw icon animations (inline SVG sprite)
- Subtle magnetic icons, eased cursor glow (desktop pointers only)
- Liquid Dark / Liquid Light themes persisted in `localStorage`
- Separate mobile experience (<768px): animated hamburger, circular-reveal full-screen menu, accordions, scroll lock
- Search dialog (native `<dialog>`)

## Technologies
HTML5, CSS3 (custom properties, `@property`, `color-mix`, `clip-path`), Vanilla ES6+, inline SVG.

## Structure
```
index.html
css/  style.css · animations.css · responsive.css
js/   main.js · navigation.js · animations.js · theme.js
assets/icons/flux.svg
```

## Install
Open `index.html` in a browser, or serve the folder: `npx serve .` / `python3 -m http.server`. Scripts are classic (non-module) so `file://` works.

## Customization
- **Menu content:** edit the `.pane[data-pane=…]` blocks in `index.html`. Add a pane plus a `<button data-menu="name">`, a `RADII.name` entry in `navigation.js` and a `.panel[data-active=name]` accent in `style.css`.
- **Animation:** timing/easing live in `--ease` and the `transition` on `.panel` (`style.css`); stagger is `animation-delay` on `.pane.on .st` (`animations.css`); hover/close delays are `scheduleClose(…)` in `navigation.js`.
- **Magnetic strength:** the `* 6` factor in `handleMagneticHover()`.
- **Themes:** variables in `:root` and `[data-theme=light]`; panel accents via `--c1/--c2`.

## Responsive behavior
≤1100px icons hide in the bar; ≤1000px the featured card spans the mega menu; ≤900px the CTA moves out; <768px the full-screen mobile menu replaces dropdowns.

## Accessibility
Semantic `nav`/`ul`/`button`, `aria-expanded` / `aria-controls` / `aria-current`, hidden panes are `inert`, Tab, Enter/Space, Escape (returns focus), ←/→ between items, ↓ into a menu, ↑/↓ inside it, visible focus rings, skip link, `prefers-reduced-motion` support.

## Browser compatibility
Current Chrome, Edge, Safari and Firefox (128+ for the animated panel accent colors; older versions fall back to an instant color change). `backdrop-filter` falls back to a plain translucent surface.
