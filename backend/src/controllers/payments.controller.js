/**
 * payments.controller.js – Stripe + cash payment controller
 * Creates Stripe PaymentIntents for card payments and records cash payments.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../config/db');

/**
 * POST /api/payments/create-intent
 * Creates a Stripe PaymentIntent for a given fare amount.
 * Body: { amount, currency?, seatId, routeId }
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'zmw', seatId, routeId } = req.body;

    if (!amount || !seatId || !routeId) {
      return res.status(400).json({ error: 'amount, seatId, and routeId are required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to lowest currency unit
      currency,
      metadata: { seatId, routeId, userId: req.user.uid },
    });

    // Record pending payment
    await db.query(
      `INSERT INTO payments (user_id, seat_id, route_id, amount, currency, method, stripe_intent_id, status)
       VALUES ($1, $2, $3, $4, $5, 'card', $6, 'pending')`,
      [req.user.uid, seatId, routeId, amount, currency, paymentIntent.id]
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment intent error:', err.message);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

/**
 * POST /api/payments/confirm
 * Confirms a payment (called after Stripe webhook or client confirmation).
 * Body: { paymentIntentId }
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const result = await db.query(
      `UPDATE payments SET status = 'completed', updated_at = NOW()
       WHERE stripe_intent_id = $1
       RETURNING *`,
      [paymentIntentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: result.rows[0] });
  } catch (err) {
    console.error('Confirm payment error:', err.message);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

/**
 * POST /api/payments/cash
 * Records a cash payment (conductor-initiated).
 * Body: { seatId, routeId, amount }
 */
exports.recordCashPayment = async (req, res) => {
  try {
    const { seatId, routeId, amount } = req.body;

    if (!seatId || !routeId || !amount) {
      return res.status(400).json({ error: 'seatId, routeId, and amount are required' });
    }

    const result = await db.query(
      `INSERT INTO payments (user_id, seat_id, route_id, amount, currency, method, status)
       VALUES ($1, $2, $3, $4, 'zmw', 'cash', 'completed')
       RETURNING *`,
      [req.user.uid, seatId, routeId, amount]
    );

    res.status(201).json({ payment: result.rows[0] });
  } catch (err) {
    console.error('Cash payment error:', err.message);
    res.status(500).json({ error: 'Failed to record cash payment' });
  }
};

/**
 * GET /api/payments/history
 * Returns payment history for the authenticated user.
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, r.route_name, r.origin, r.destination AS route_destination
       FROM payments p
       LEFT JOIN routes r ON p.route_id = r.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [req.user.uid]
    );

    res.json({ payments: result.rows });
  } catch (err) {
    console.error('Payment history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};
