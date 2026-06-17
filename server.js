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

dotenv.config();

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

io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  // ======================
  // USER ROOM
  // ======================
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  // ======================
  // EVENT ROOM
  // ======================
  socket.on("join-event", (eventId) => {
    socket.join(eventId);
    console.log(`Joined event room: ${eventId}`);
  });

  // ======================
  // LEAVE EVENT ROOM
  // ======================
  socket.on("leave-event", (eventId) => {
    socket.leave(eventId);
    console.log(`Left event room: ${eventId}`);
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

// MODULE 6
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingRoutes);

// ==========================
// HEALTH CHECK
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
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err.message);
  });