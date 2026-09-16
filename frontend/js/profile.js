const profileCard = document.getElementById('profileCard');

const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
const email = localStorage.getItem('email');

if (token && username) {
  profileCard.innerHTML = `
    <div class="profile-avatar">${username.charAt(0).toUpperCase()}</div>
    <h2>${username}</h2>
    <p>${email || ''}</p>
    <button class="btn btn-secondary" id="logoutBtn">Logout</button>
  `;

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = 'index.html';
  });
}
