import { io } from "socket.io-client";

// Create socket instance
const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection logs (helpful for debugging)
socket.on("connect", () => {
  console.log("🟢 Connected to server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from server");
});

export default socket;