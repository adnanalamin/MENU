<div align="center">

# MENU

### The Open Collection of Modern Web Navigation

**500+ responsive • animated • accessible • reusable menu components**

[![GitHub stars](https://img.shields.io/github/stars/adnanalamin/MENU?style=for-the-badge&logo=github)](https://github.com/adnanalamin/MENU/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/adnanalamin/MENU?style=for-the-badge&logo=github)](https://github.com/adnanalamin/MENU/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-8b5cf6?style=for-the-badge)](https://adnanalamin.github.io/MENU/)

**Explore. Preview. Learn. Build.**

[Live Demo](https://adnanalamin.github.io/MENU/) · [Browse Categories](#-menu-categories) · [Contributing](CONTRIBUTING.md) · [Roadmap](#-roadmap)

</div>

---

## ✨ About MENU

**MENU** is an open-source collection of web navigation patterns for developers, designers, students and creators. It brings together simple navigation bars, mega menus, mobile menus, sidebars, animated interactions and framework-specific implementations in one organized repository.

The long-term goal is to publish **500+ practical menu examples**, each with a live preview, readable source code and clear usage instructions.

> This repository is a learning and component reference library. Examples are independent projects; framework-specific examples may require their own setup.

## 🚀 Live Demo

Visit the interactive gallery: **[adnanalamin.github.io/MENU](https://adnanalamin.github.io/MENU/)**

The demo homepage is a searchable, filterable directory. Each published example should link to its own preview or documentation page.

## 🧭 Menu Categories

| # | Category | Planned examples |
|---|---|---:|
| 01 | Basic Navigation | 35+ |
| 02 | Dropdown Menus | 35+ |
| 03 | Mega Menus | 35+ |
| 04 | Animated Menus | 45+ |
| 05 | Mobile Navigation | 40+ |
| 06 | Sidebar & Dashboard Menus | 40+ |
| 07 | E-commerce Navigation | 30+ |
| 08 | Creative & Experimental Menus | 35+ |
| 09 | Full-screen & Overlay Menus | 25+ |
| 10 | CSS-only Menus | 30+ |
| 11 | JavaScript Menus | 30+ |
| 12 | Bootstrap Menus | 30+ |
| 13 | Tailwind CSS Menus | 30+ |
| 14 | React Navigation Components | 40+ |
| 15 | Accessibility & Special Patterns | 20+ |
| | **Total target** | **500+** |

Counts are planning targets, not a claim that all examples are already published.

## 🧰 Technologies

- **Core:** HTML5, CSS3, Vanilla JavaScript
- **CSS frameworks:** Bootstrap 5, Tailwind CSS
- **UI library:** React
- **Optional integrations:** React Router and icon libraries where an example needs them

Each example must clearly state its required technology and dependencies. Core examples should avoid unnecessary dependencies.

## 📁 Repository Structure

```text
MENU/
├── index.html                  # Interactive GitHub Pages gallery
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── ROADMAP.md
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── screenshots/
├── 01-basic-navigation/
│   └── 001-simple-navbar/
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       ├── preview.png
│       └── README.md
├── 02-dropdown-menus/
├── 03-mega-menus/
├── 04-animated-menus/
├── 05-mobile-navigation/
├── 06-sidebar-dashboard/
├── 07-ecommerce-navigation/
├── 08-creative-menus/
├── 09-fullscreen-overlay/
├── 10-css-only/
├── 11-javascript/
├── 12-bootstrap/
├── 13-tailwind/
├── 14-react/
└── 15-accessibility-patterns/
```

Use a numbered folder for each example (for example, `001-simple-navbar`) so examples remain easy to find as the collection grows.

## 🧩 Example Folder Standard

Every menu should be self-contained and follow the same conventions:

```text
001-example-name/
├── index.html
├── style.css
├── script.js
├── preview.png
└── README.md
```

For React or build-tool examples, include the required project files such as `package.json`, `src/` and setup instructions instead of forcing the plain HTML structure.

Every example README should include:

1. Name and category
2. Short description
3. Technology and dependencies
4. Screenshot or GIF preview
5. Features
6. How to run locally
7. Customization notes
8. Keyboard and accessibility notes
9. Browser support

## 🧪 Quality Standards

Before an example is merged, check that it:

- [ ] Works at mobile, tablet and desktop widths
- [ ] Has no horizontal overflow at common viewport sizes
- [ ] Supports keyboard navigation where interactive
- [ ] Uses semantic HTML and meaningful accessible labels
- [ ] Has visible focus states and sensible contrast
- [ ] Respects `prefers-reduced-motion`
- [ ] Opens and closes predictably; no accidental hover-only interaction on touch
- [ ] Has no console errors or broken assets
- [ ] Includes a screenshot and accurate README
- [ ] Uses original code/design or properly attributed assets

## ⚡ Run Locally

Most HTML/CSS/JavaScript examples can be opened directly:

1. Clone the repository.
   ```bash
   git clone https://github.com/adnanalamin/MENU.git
   ```
2. Open the project folder.
3. Open the root `index.html` in your browser, or use the VS Code **Live Server** extension.
4. Select a category and open an example.

For React examples, follow the `README.md` inside that example and install its dependencies.

## 🌐 Publish with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`.
5. Save and wait for deployment.
6. Your gallery will be available at `https://adnanalamin.github.io/MENU/`.

The root gallery is plain HTML, CSS and JavaScript, so it does not need a build step.

## ➕ Add a New Menu

See [ADD-NEW-MENU.md](ADD-NEW-MENU.md). Add the example folder, then register it once in `assets/js/menus-data.js`; the gallery search and filters update automatically.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

Good contributions include:

- New menu patterns
- Responsive and accessibility improvements
- Bug fixes and browser compatibility fixes
- Better documentation and screenshots
- Framework-specific versions of existing patterns

Avoid submitting near-duplicate examples. Prefer a genuinely useful variation with a clear purpose.

## 🗺️ Roadmap

See **[ROADMAP.md](ROADMAP.md)** for the staged plan from the first 20 examples to the 500+ library.

- [ ] Foundation and gallery
- [ ] First 20 core menus
- [ ] 100-menu milestone
- [ ] Framework collections
- [ ] 250-menu milestone
- [ ] 500+ menu collection
- [ ] Search, filters and contribution automation improvements

## 📜 License

This project is intended to use the **MIT License**. Add the `LICENSE` file containing the standard MIT license text and your copyright details before publishing. Individual third-party assets may have separate licenses; check them before use.

## 👤 Maintainer

Created and maintained by **AL AMIN ADNAN**.

- GitHub: [@adnanalamin](https://github.com/adnanalamin)

---

<div align="center">

**If MENU helps you, consider giving the repository a ⭐**

Made for the developer community.

</div>
