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

import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import userBadgeRoutes from "./routes/userBadgeRoutes.js";

import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";

import pointsRoutes from "./routes/pointsRoutes.js";

// ⭐ AUDIT LOG ROUTES (NEW)
import auditLogRoutes from "./routes/auditLogRoutes.js";

dotenv.config();

console.log("CLIENT_URL =", process.env.CLIENT_URL);

const app = express();
const server = http.createServer(app);

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
// SOCKET.IO
// ==========================
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ==========================
// SOCKET EVENTS MAP
// ==========================
const SOCKET_EVENTS = {
  JOIN: "join",
  JOIN_EVENT: "join-event",
  LEAVE_EVENT: "leave-event",

  ATTENDANCE_CHECKIN: "attendance:checkin",
  ATTENDANCE_CHECKOUT: "attendance:checkout",
  ATTENDANCE_COMPLETED: "attendance:completed",

  TEAM_CREATED: "team-created",
  POINTS_UPDATE: "points:update",

  // ⭐ NEW (AUDIT LOG REALTIME EVENT)
  AUDIT_LOG_NEW: "audit:log:new",
};

// ==========================
// SOCKET HANDLER
// ==========================
io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  socket.on(SOCKET_EVENTS.JOIN, (userId) => {
    socket.join(userId);
  });

  socket.on(SOCKET_EVENTS.JOIN_EVENT, (eventId) => {
    socket.join(eventId);
  });

  socket.on(SOCKET_EVENTS.LEAVE_EVENT, (eventId) => {
    socket.leave(eventId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});

// ==========================
// ROUTES
// ==========================

// AUTH / CORE
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

// MODULE 2
app.use("/api/certificates", certificateRoutes);

// MODULE 3
app.use("/api/teams", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// MODULE 4
app.use("/api/attendance", attendanceRoutes);

// MODULE 5
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user-badges", userBadgeRoutes);

// POINTS
app.use("/api/points", pointsRoutes);

// MODULE 6
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingRoutes);

// ⭐ AUDIT LOGS ROUTE (NEW)
app.use("/api/audit-logs", auditLogRoutes);

// ==========================
// HEALTH CHECK
// ==========================
app.get("/", (req, res) => {
  res.send("CyberKavach API Running 🚀");
});

// ==========================
// OPTIONAL: GLOBAL AUDIT EMITTER HELPER
// (use this in controllers later)
// ==========================
export const emitAuditLog = (log) => {
  io.emit(SOCKET_EVENTS.AUDIT_LOG_NEW, log);
};

// ==========================
// DATABASE + SERVER START
// ==========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });