# Add a New Menu

The gallery is registry-driven. **Do not edit `app.js` for every menu.**

## 1. Create the folder

```text
03-mega-menus/001-animated-mega-menu/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 2. Register it once
Open `assets/js/menus-data.js` and add:

```js
{
  id: "001-animated-mega-menu",
  name: "Animated Mega Menu",
  category: "Mega",
  categoryName: "Mega Menus",
  technology: ["HTML & CSS", "JavaScript"],
  description: "A responsive multi-column mega navigation.",
  path: "03-mega-menus/001-animated-mega-menu/",
  tags: ["mega", "animated", "responsive", "navigation"]
}
```

## 3. Test
Search by name/tag, use category/technology filters, click Live Preview, and test the menu on desktop/tablet/mobile.

**Workflow:** Create folder → add files → add one registry object → refresh gallery.
