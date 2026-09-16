const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { SECRET } = require('../middleware/auth');

const usersPath = path.join(__dirname, '../data/users.json');

function readUsers() {
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
}
function writeUsers(users) {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' });
  }
  const users = readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), username, email, password: hashed };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({ message: 'Registered successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, username: user.username, email: user.email });
});

module.exports = router;
