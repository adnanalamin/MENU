
const grid = document.getElementById("categoryGrid");
const searchInput = document.getElementById("searchInput");
const techFilter = document.getElementById("techFilter");
const typeFilter = document.getElementById("typeFilter");
const resultCount = document.getElementById("resultCount");

// HTML escaping for safe rendering
function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

// Render all menu components
function renderMenus() {
  const query = searchInput.value.trim().toLowerCase();
  const technology = techFilter.value;
  const category = typeFilter.value;

  const filteredMenus = menuItems.filter(menu => {
    const searchableText = [
      menu.name,
      menu.category,
      menu.categoryName,
      menu.description,
      ...(menu.technology || []),
      ...(menu.tags || [])
    ].join(" ").toLowerCase();

    const matchesSearch =
      !query || searchableText.includes(query);

    const matchesTechnology =
      technology === "all" ||
      (menu.technology || []).includes(technology);

    const matchesCategory =
      category === "all" ||
      menu.category === category;

    return matchesSearch && matchesTechnology && matchesCategory;
  });

  grid.innerHTML = filteredMenus.length
    ? filteredMenus.map(menu => `
      <article class="category-card menu-card">

        <div class="card-top">
          <div class="card-icon" aria-hidden="true">M</div>
          <span class="card-number">${esc(menu.id)}</span>
        </div>

        <h3>${esc(menu.name)}</h3>

        <p>${esc(menu.description)}</p>

        <div class="tags">
          ${[menu.categoryName, ...(menu.technology || [])]
            .map(tag => `
              <span class="tag">${esc(tag)}</span>
            `).join("")}
        </div>

        <div class="menu-card-actions">
          <a class="button primary"
             href="${esc(menu.path)}index.html">
            Live Preview ↗
          </a>

          <a class="source-link"
             href="${esc(menu.path)}README.md">
            README
          </a>
        </div>

      </article>
    `).join("")
    : `
      <div class="empty-state">
        <h3>No menus found</h3>
        <p>Try another search term or filter.</p>
      </div>
    `;

  resultCount.textContent =
    `${filteredMenus.length} of ${menuItems.length} menus`;
}

// Search and filters
searchInput.addEventListener("input", renderMenus);
techFilter.addEventListener("change", renderMenus);
typeFilter.addEventListener("change", renderMenus);

// Mobile navigation
const toggle = document.getElementById("mobileToggle");
const nav = document.querySelector(".top-links");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Dynamic year
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Initial rendering
renderMenus();
