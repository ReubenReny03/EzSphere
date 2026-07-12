import { io } from 'socket.io-client';

let socket = null;

// Same fallback as the API client: use the host the page was loaded from so
// this works over localhost and Tailscale without per-device .env edits.
const inferredSocketUrl = `${window.location.protocol}//${window.location.hostname}:5000`;

export const connectSocket = (token) => {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL || inferredSocketUrl, {
    auth: { token },
    autoConnect: true,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
