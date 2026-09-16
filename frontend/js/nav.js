// Updates the "User Profile" nav link depending on login state.
document.addEventListener('DOMContentLoaded', () => {
  const navUserLink = document.getElementById('navUserLink');
  if (!navUserLink) return;

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (token && username) {
    navUserLink.textContent = username;
    navUserLink.setAttribute('href', 'profile.html');
  } else {
    navUserLink.textContent = 'User Profile';
    navUserLink.setAttribute('href', 'login.html');
  }
});
