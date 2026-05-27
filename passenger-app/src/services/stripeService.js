/**
 * stripeService.js – Stripe payment helpers for the passenger app
 * Wraps backend calls to create and confirm payments.
 */

import api from './api';

/**
 * Creates a Stripe PaymentIntent on the backend and returns the client secret.
 */
export async function createPaymentIntent({ amount, seatId, routeId }) {
  const { data } = await api.post('/payments/create-intent', {
    amount,
    seatId,
    routeId,
  });
  return data.clientSecret;
}

/**
 * Confirms a completed payment on the backend.
 */
export async function confirmPayment(paymentIntentId) {
  const { data } = await api.post('/payments/confirm', { paymentIntentId });
  return data.payment;
}

/**
 * Records a cash payment (fallback method).
 */
export async function recordCashPayment({ seatId, routeId, amount }) {
  const { data } = await api.post('/payments/cash', { seatId, routeId, amount });
  return data.payment;
}

export default { createPaymentIntent, confirmPayment, recordCashPayment };
