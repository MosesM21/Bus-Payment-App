/**
 * payments.routes.js – Stripe + cash payment endpoints
 */

const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const {
  createPaymentIntent,
  confirmPayment,
  recordCashPayment,
  getPaymentHistory,
} = require('../controllers/payments.controller');

// POST /api/payments/create-intent  – create Stripe PaymentIntent
router.post('/create-intent', verifyToken, createPaymentIntent);

// POST /api/payments/confirm        – confirm a completed payment
router.post('/confirm', verifyToken, confirmPayment);

// POST /api/payments/cash           – record a cash payment
router.post('/cash', verifyToken, recordCashPayment);

// GET  /api/payments/history        – user payment history
router.get('/history', verifyToken, getPaymentHistory);

module.exports = router;
