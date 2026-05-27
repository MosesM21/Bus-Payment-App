/**
 * server.js – Entry point
 * Boots Express app + Socket.IO and listens on the configured PORT.
 */

require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSeatSocket } = require('./src/sockets/seatSocket');

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSeatSocket(server);

server.listen(PORT, () => {
  console.log(`🚌  Bus Payment API running on port ${PORT}`);
  console.log(`📡  Socket.IO ready for real-time seat updates`);
});
