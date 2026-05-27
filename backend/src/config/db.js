/**
 * db.js – PostgreSQL connection pool
 * Uses the DATABASE_URL from .env to create a reusable pg Pool.
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // In production, consider adding SSL:
  // ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('🗄️  Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('🗄️  PostgreSQL pool error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
