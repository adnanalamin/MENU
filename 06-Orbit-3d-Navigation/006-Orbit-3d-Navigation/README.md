# ORBIT — 3D Perspective Navigation

A futuristic landing page and navigation built with plain HTML, CSS and JavaScript. No frameworks, no libraries, no build step.

## Run it

Open `index.html` in any modern browser, or serve the folder:

```
python3 -m http.server 8000
```

## What is inside

- **Desktop navigation:** floating bar, glowing active indicator, one dropdown open at a time, 3D panel entrance (rotateX -12deg to 0) with staggered items.
- **Services:** five icons orbiting a glowing core. Hover or focus an icon to enlarge it and show its title. Click or press Enter to read its description. Arrow keys, Home and End move between icons.
- **Products / Resources / About:** floating 3D cards, a three-column mega menu, and a compact panel.
- **Mouse effects (fine pointers only):** panel tilt, cursor glow, magnetic links, hero tilt. All reset when the pointer leaves.
- **Mobile (900px and below):** hamburger, full-screen overlay, accordion sections, focus trap, body scroll lock.
- **Accessibility:** skip link, ARIA expanded/controls, Escape closes menus, Left/Right/Down arrows on the bar, visible focus, `prefers-reduced-motion` support.

## Files

| File | Role |
|---|---|
| `css/style.css` | Tokens, layout, components |
| `css/animations.css` | Keyframes, reveal, reduced motion |
| `css/responsive.css` | Breakpoints from 320px up |
| `js/navigation.js` | Dropdowns, indicator, mobile overlay |
| `js/orbit.js` | Orbit motion, selection, keyboard |
| `js/interactions.js` | Pointer effects, particles, scroll reveal |
| `js/main.js` | Startup |
