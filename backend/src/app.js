/**
 * app.js – Express application setup
 * Registers middleware, routes, and error handling.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route imports
const authRoutes = require('./routes/auth.routes');
const seatsRoutes = require('./routes/seats.routes');
const paymentsRoutes = require('./routes/payments.routes');
const routesRoutes = require('./routes/routes.routes');

const app = express();

// ─── Global Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/routes', routesRoutes);

// ─── 404 Handler ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ───────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

module.exports = app;
