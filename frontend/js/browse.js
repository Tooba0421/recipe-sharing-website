const recipeGrid = document.getElementById('recipeGrid');
const categoryFilter = document.getElementById('categoryFilter');
const timeFilter = document.getElementById('timeFilter');

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadRecipes() {
  const category = categoryFilter.value;
  const time = timeFilter.value;
  const search = getQueryParam('search') || '';

  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (time) params.set('time', time);
  if (search) params.set('search', search);

  recipeGrid.innerHTML = '<p class="empty-state">Loading recipes...</p>';

  try {
    const res = await fetch(`${API_BASE}/recipes?${params.toString()}`);
    const recipes = await res.json();

    if (!recipes.length) {
      recipeGrid.innerHTML = '<p class="empty-state">No recipes found. Try different filters.</p>';
      return;
    }

    recipeGrid.innerHTML = recipes.map(r => `
      <a href="recipe.html?id=${r.id}" class="recipe-card">
        <img src="${r.image}" alt="${r.title}" />
        <div class="recipe-card-body">
          <h3>${r.title}</h3>
          <p>${r.description}</p>
          <div class="recipe-meta">
            <span class="badge">${r.category}</span>
            <span>⭐ ${r.rating}</span>
            <span>${r.difficulty}</span>
          </div>
        </div>
      </a>
    `).join('');
  } catch (err) {
    recipeGrid.innerHTML = '<p class="empty-state">Failed to load recipes. Is the backend server running?</p>';
  }
}

// Initialize filters from URL query params
const initialCategory = getQueryParam('category');
if (initialCategory) categoryFilter.value = initialCategory;

categoryFilter.addEventListener('change', loadRecipes);
timeFilter.addEventListener('change', loadRecipes);

document.getElementById('browseSearchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('browseSearchInput').value.trim();
  const params = new URLSearchParams(window.location.search);
  if (q) params.set('search', q); else params.delete('search');
  window.location.search = params.toString();
});

const existingSearch = getQueryParam('search');
if (existingSearch) document.getElementById('browseSearchInput').value = existingSearch;

loadRecipes();
