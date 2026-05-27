/**
 * routes.routes.js – Bus routes & fares endpoints
 */

const router = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getAllRoutes,
  getRouteById,
  calculateFare,
} = require('../controllers/routes.controller');

// GET /api/routes              – list all bus routes
router.get('/', getAllRoutes);

// GET /api/routes/:routeId     – single route with stops & fares
router.get('/:routeId', getRouteById);

// GET /api/routes/:routeId/fare?from=&to=  – fare calculator
router.get('/:routeId/fare', verifyToken, calculateFare);

module.exports = router;
