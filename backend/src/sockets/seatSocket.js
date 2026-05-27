/**
 * seatSocket.js – Socket.IO event handlers for real-time seat updates
 * Handles seat reservations, releases, and stop request broadcasts.
 */

const { Server } = require('socket.io');

let io;

function initSeatSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // ── Join a specific bus room ────────────────────────
    socket.on('join-bus', (busId) => {
      socket.join(`bus:${busId}`);
      console.log(`🚌 ${socket.id} joined bus:${busId}`);
    });

    // ── Seat status changed (reserved / released) ──────
    socket.on('seat-update', (data) => {
      // data: { busId, seatNumber, status, passengerId? }
      io.to(`bus:${data.busId}`).emit('seat-changed', data);
    });

    // ── Passenger requests a stop ──────────────────────
    socket.on('stop-request', (data) => {
      // data: { busId, passengerId, stopName }
      io.to(`bus:${data.busId}`).emit('stop-requested', data);
      console.log(`🛑 Stop requested on bus ${data.busId}: ${data.stopName}`);
    });

    // ── Conductor acknowledges stop ────────────────────
    socket.on('stop-acknowledged', (data) => {
      io.to(`bus:${data.busId}`).emit('stop-ack', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialised – call initSeatSocket first');
  return io;
}

module.exports = { initSeatSocket, getIO };
