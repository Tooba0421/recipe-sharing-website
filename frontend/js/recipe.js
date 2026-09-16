const recipeDetail = document.getElementById('recipeDetail');

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadRecipe() {
  const id = getQueryParam('id');
  if (!id) {
    recipeDetail.innerHTML = '<p class="empty-state">No recipe specified.</p>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) {
      recipeDetail.innerHTML = '<p class="empty-state">Recipe not found.</p>';
      return;
    }
    const r = await res.json();

    recipeDetail.innerHTML = `
      <img src="${r.image}" alt="${r.title}" />
      <h1>${r.title}</h1>
      <div class="recipe-meta">
        <span class="badge">${r.category}</span>
        <span>⭐ ${r.rating}</span>
        <span>${r.difficulty}</span>
        <span>${r.time} min</span>
      </div>
      <p>${r.description}</p>

      <h2>Ingredients</h2>
      <ul class="ingredients">
        ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
      </ul>

      <h2>Step-by-Step Instructions</h2>
      <ol class="instructions">
        ${r.instructions.map(step => `<li>${step}</li>`).join('')}
      </ol>
    `;
  } catch (err) {
    recipeDetail.innerHTML = '<p class="empty-state">Failed to load recipe. Is the backend server running?</p>';
  }
}

loadRecipe();
