const form = document.getElementById('submitRecipeForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';
  formMessage.className = 'form-message';

  const token = localStorage.getItem('token');
  if (!token) {
    formMessage.textContent = 'You must be logged in to submit a recipe.';
    formMessage.classList.add('error');
    setTimeout(() => window.location.href = 'login.html', 1200);
    return;
  }

  const payload = {
    title: document.getElementById('title').value.trim(),
    ingredients: document.getElementById('ingredients').value,
    instructions: document.getElementById('instructions').value,
    category: document.getElementById('category').value,
    time: document.getElementById('time').value
  };

  try {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      formMessage.textContent = data.message || 'Failed to submit recipe.';
      formMessage.classList.add('error');
      return;
    }

    formMessage.textContent = 'Recipe submitted successfully! Redirecting...';
    formMessage.classList.add('success');
    setTimeout(() => window.location.href = `recipe.html?id=${data.id}`, 1000);
  } catch (err) {
    formMessage.textContent = 'Something went wrong. Is the backend server running?';
    formMessage.classList.add('error');
  }
});
