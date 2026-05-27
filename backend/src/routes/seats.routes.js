/**
 * seats.routes.js – Seat status CRUD endpoints
 */

const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getSeatsByBus,
  reserveSeat,
  releaseSeat,
} = require('../controllers/seats.controller');

// GET    /api/seats/:busId       – all seats for a bus
router.get('/:busId', verifyToken, getSeatsByBus);

// PATCH  /api/seats/:seatId/reserve  – reserve a seat
router.patch('/:seatId/reserve', verifyToken, reserveSeat);

// PATCH  /api/seats/:seatId/release  – release a seat
router.patch('/:seatId/release', verifyToken, releaseSeat);

module.exports = router;
