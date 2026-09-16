const form = document.getElementById('registerForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';
  formMessage.className = 'form-message';

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      formMessage.textContent = data.message || 'Registration failed.';
      formMessage.classList.add('error');
      return;
    }

    formMessage.textContent = 'Registered successfully! Redirecting to login...';
    formMessage.classList.add('success');
    setTimeout(() => window.location.href = 'login.html', 1000);
  } catch (err) {
    formMessage.textContent = 'Something went wrong. Is the backend server running?';
    formMessage.classList.add('error');
  }
});
