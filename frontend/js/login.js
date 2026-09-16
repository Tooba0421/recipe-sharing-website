const form = document.getElementById('loginForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMessage.textContent = '';
  formMessage.className = 'form-message';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      formMessage.textContent = data.message || 'Login failed.';
      formMessage.classList.add('error');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);

    formMessage.textContent = 'Login successful! Redirecting...';
    formMessage.classList.add('success');
    setTimeout(() => window.location.href = 'profile.html', 800);
  } catch (err) {
    formMessage.textContent = 'Something went wrong. Is the backend server running?';
    formMessage.classList.add('error');
  }
});
