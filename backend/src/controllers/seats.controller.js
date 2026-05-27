/**
 * seats.controller.js – Seat status CRUD controller
 * Manages seat availability, reservations, and releases for a given bus.
 */

const db = require('../config/db');
const { getIO } = require('../sockets/seatSocket');

/**
 * GET /api/seats/:busId
 * Returns all seats for a specific bus.
 */
exports.getSeatsByBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const result = await db.query(
      'SELECT * FROM seats WHERE bus_id = $1 ORDER BY seat_number',
      [busId]
    );
    res.json({ seats: result.rows });
  } catch (err) {
    console.error('Fetch seats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
};

/**
 * PATCH /api/seats/:seatId/reserve
 * Reserves a seat for a passenger.
 * Body: { passengerId, destination }
 */
exports.reserveSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const { passengerId, destination } = req.body;

    const result = await db.query(
      `UPDATE seats
       SET status = 'reserved', passenger_id = $1, destination = $2, updated_at = NOW()
       WHERE id = $3 AND status = 'available'
       RETURNING *`,
      [passengerId, destination, seatId]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ error: 'Seat is no longer available' });
    }

    const seat = result.rows[0];

    // Broadcast real-time update
    getIO().to(`bus:${seat.bus_id}`).emit('seat-changed', {
      busId: seat.bus_id,
      seatNumber: seat.seat_number,
      status: 'reserved',
      passengerId,
    });

    res.json({ seat });
  } catch (err) {
    console.error('Reserve seat error:', err.message);
    res.status(500).json({ error: 'Failed to reserve seat' });
  }
};

/**
 * PATCH /api/seats/:seatId/release
 * Releases a reserved seat back to available.
 */
exports.releaseSeat = async (req, res) => {
  try {
    const { seatId } = req.params;

    const result = await db.query(
      `UPDATE seats
       SET status = 'available', passenger_id = NULL, destination = NULL, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [seatId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    const seat = result.rows[0];

    getIO().to(`bus:${seat.bus_id}`).emit('seat-changed', {
      busId: seat.bus_id,
      seatNumber: seat.seat_number,
      status: 'available',
    });

    res.json({ seat });
  } catch (err) {
    console.error('Release seat error:', err.message);
    res.status(500).json({ error: 'Failed to release seat' });
  }
};
