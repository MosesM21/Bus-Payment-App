/**
 * seatColors.js – Colour constants for seat status
 *
 * Grey   → Available (no passenger)
 * Orange → Reserved (selected but not paid)
 * Red    → Occupied (paid, passenger on board)
 * Green  → Requesting stop (passenger wants to alight)
 */

export const SEAT_COLORS = {
  available: '#9E9E9E',   // Grey
  reserved: '#FF9800',    // Orange
  occupied: '#F44336',    // Red
  stopping: '#4CAF50',    // Green
};

export const SEAT_LABELS = {
  available: 'Available',
  reserved: 'Reserved',
  occupied: 'Occupied',
  stopping: 'Stop Requested',
};

export default SEAT_COLORS;
