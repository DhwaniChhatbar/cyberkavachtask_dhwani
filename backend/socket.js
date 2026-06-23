import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ==========================
// SOCKET.IO SETUP
// ==========================
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ==========================
// SOCKET EVENTS (SAFE FALLBACK)
// ==========================
const SOCKET_EVENTS = {
  JOIN: "join",
  JOIN_EVENT: "join-event",
  LEAVE_EVENT: "leave-event",

  // attendance
  ATTENDANCE_CHECKIN: "attendance:checkin",
  ATTENDANCE_CHECKOUT: "attendance:checkout",
  ATTENDANCE_COMPLETED: "attendance:completed",

  // teams
  TEAM_CREATED: "team-created",

  // points
  POINTS_UPDATE: "points:update",
};

// ==========================
// USER SOCKET MAP
// ==========================
const userSocketMap = new Map();

// ==========================
// SOCKET CONNECTION
// ==========================
io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // JOIN USER ROOM
  socket.on(SOCKET_EVENTS.JOIN, (userId) => {
    socket.join(userId);
    userSocketMap.set(userId, socket.id);
  });

  // JOIN EVENT ROOM
  socket.on(SOCKET_EVENTS.JOIN_EVENT, (eventId) => {
    socket.join(eventId);
  });

  // LEAVE EVENT ROOM
  socket.on(SOCKET_EVENTS.LEAVE_EVENT, (eventId) => {
    socket.leave(eventId);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
});

// ==========================
// MIDDLEWARE
// ==========================
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/settings", settingRoutes);

// ==========================
// TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("CyberKavach API Running 🚀");
});

// ==========================
// DATABASE + SERVER START
// ==========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
  });