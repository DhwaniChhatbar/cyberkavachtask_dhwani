import { io } from "socket.io-client";

// ==========================
// ENV SAFE BASE URL
// ==========================
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// ==========================
// SINGLE SOCKET INSTANCE
// ==========================
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,

  // ==========================
  // RECONNECTION CONFIG
  // ==========================
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// ==========================
// AUTO CONNECT LOGS
// ==========================
socket.on("connect", () => {
  console.log("🟢 Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket Disconnected:", reason);
});

// ==========================
// HELPER FUNCTIONS (IMPORTANT)
// ==========================

// Join user room
export const joinUserRoom = (userId) => {
  if (userId) {
    socket.emit("join", userId);
  }
};

// Join event room
export const joinEventRoom = (eventId) => {
  if (eventId) {
    socket.emit("join-event", eventId);
  }
};

// Leave event room
export const leaveEventRoom = (eventId) => {
  if (eventId) {
    socket.emit("leave-event", eventId);
  }
};

// ==========================
// EXPORT SOCKET
// ==========================
export default socket;