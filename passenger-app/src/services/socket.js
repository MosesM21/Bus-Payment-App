/**
 * socket.js – Socket.IO client setup for the passenger app
 */

import { io } from 'socket.io-client';

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

  socket.on('connect', () => console.log('🔌 Socket connected:', socket.id));
  socket.on('disconnect', (reason) => console.log('🔌 Socket disconnected:', reason));

  return socket;
}

export function joinBus(busId) {
  if (!socket) connectSocket();
  socket.emit('join-bus', busId);
}

export function requestStop(busId, passengerId, stopName) {
  if (!socket) return;
  socket.emit('stop-request', { busId, passengerId, stopName });
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

export default { connectSocket, joinBus, requestStop, disconnectSocket, getSocket };
