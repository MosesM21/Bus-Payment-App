/**
 * verifyToken.js – Firebase ID-token verification middleware
 * Extracts the Bearer token from the Authorization header and verifies it
 * using Firebase Admin. Attaches the decoded user to req.user.
 */

const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized – no token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('🔒 Token verification failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized – invalid token' });
  }
};

module.exports = verifyToken;
