const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('CRITICAL: JWT_SECRET environment variable is missing.');
    return res.status(500).json({ error: 'Internal authentication configuration error' });
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
