/**
 * socket.js – Socket.IO client setup for the conductor app
 * Connects to the backend and provides helpers for seat events.
 */

import { io } from 'socket.io-client';

// TODO: Update with your backend URL
const SOCKET_URL = 'http://localhost:5000';

let socket = null;

export function connectSocket() {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  return socket;
}

export function joinBus(busId) {
  if (!socket) connectSocket();
  socket.emit('join-bus', busId);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export default { connectSocket, joinBus, disconnectSocket, getSocket };
