/**
 * auth.controller.js – Authentication controller
 * Handles OTP verification and user profile creation/retrieval.
 */

const admin = require('../config/firebase');
const db = require('../config/db');

/**
 * POST /api/auth/verify
 * Verifies a Firebase ID token (already checked by middleware)
 * and upserts the user record in PostgreSQL.
 */
exports.verifyUser = async (req, res) => {
  try {
    const { uid, phone_number } = req.user; // populated by verifyToken middleware

    // Upsert user – insert if new, return existing otherwise
    const result = await db.query(
      `INSERT INTO users (firebase_uid, phone_number)
       VALUES ($1, $2)
       ON CONFLICT (firebase_uid) DO UPDATE SET last_login = NOW()
       RETURNING *`,
      [uid, phone_number || null]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * GET /api/auth/me
 * Returns the current user profile from the database.
 */
exports.getProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const result = await db.query(
      'SELECT * FROM users WHERE firebase_uid = $1',
      [uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
