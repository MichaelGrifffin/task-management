const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbRun, dbGet } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Invalid email format (must be e.g. user@example.com)';
  }
  return null;
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      return res.status(400).json({ error: emailErr });
    }

    const passwordErr = validatePassword(password);
    if (passwordErr) {
      return res.status(400).json({ error: passwordErr });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET environment variable is missing.');
      return res.status(500).json({ error: 'Server authentication configuration error' });
    }

    // Check if email or username exists
    const existingUser = await dbGet(
      'SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?',
      [email.toLowerCase().trim(), username.toLowerCase().trim()]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const user = { id: result.id, username: username.trim(), email: email.toLowerCase().trim() };
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, jwtSecret, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      return res.status(400).json({ error: emailErr });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('CRITICAL: JWT_SECRET environment variable is missing.');
      return res.status(500).json({ error: 'Server authentication configuration error' });
    }

    const user = await dbGet('SELECT * FROM users WHERE LOWER(email) = ?', [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(userData, jwtSecret, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, username, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

module.exports = router;
