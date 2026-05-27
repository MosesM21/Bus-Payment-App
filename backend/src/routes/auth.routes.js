/**
 * auth.routes.js – OTP / authentication endpoints
 */

const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const { verifyUser, getProfile } = require('../controllers/auth.controller');

// POST /api/auth/verify – verify Firebase token & upsert user
router.post('/verify', verifyToken, verifyUser);

// GET  /api/auth/me – get current user profile
router.get('/me', verifyToken, getProfile);

module.exports = router;
