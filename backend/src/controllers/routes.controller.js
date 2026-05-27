/**
 * routes.controller.js – Bus routes & fares controller
 * CRUD for bus routes, stops, and associated fare data.
 */

const db = require('../config/db');

/**
 * GET /api/routes
 * Returns all available bus routes.
 */
exports.getAllRoutes = async (_req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM routes ORDER BY route_name'
    );
    res.json({ routes: result.rows });
  } catch (err) {
    console.error('Fetch routes error:', err.message);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
};

/**
 * GET /api/routes/:routeId
 * Returns a single route with its stops and fares.
 */
exports.getRouteById = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await db.query('SELECT * FROM routes WHERE id = $1', [routeId]);
    if (route.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const stops = await db.query(
      'SELECT * FROM stops WHERE route_id = $1 ORDER BY stop_order',
      [routeId]
    );

    const fares = await db.query(
      'SELECT * FROM fares WHERE route_id = $1 ORDER BY origin_stop_order',
      [routeId]
    );

    res.json({
      route: route.rows[0],
      stops: stops.rows,
      fares: fares.rows,
    });
  } catch (err) {
    console.error('Fetch route error:', err.message);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
};

/**
 * GET /api/routes/:routeId/fare
 * Query params: ?from=<stopOrder>&to=<stopOrder>
 * Calculates the fare between two stops on a route.
 */
exports.calculateFare = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: '"from" and "to" stop orders are required' });
    }

    const result = await db.query(
      `SELECT * FROM fares
       WHERE route_id = $1
         AND origin_stop_order = $2
         AND destination_stop_order = $3`,
      [routeId, from, to]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Fare not found for the specified stops' });
    }

    res.json({ fare: result.rows[0] });
  } catch (err) {
    console.error('Calculate fare error:', err.message);
    res.status(500).json({ error: 'Failed to calculate fare' });
  }
};
