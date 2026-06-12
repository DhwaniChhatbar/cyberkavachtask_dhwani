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

// MODULE 3 ROUTES
import teamRoutes from "./routes/teamRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// MODULE 4 ROUTES
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ==========================
// SOCKET.IO SETUP
// ==========================
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Module 1 Notifications
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  // Module 4 Attendance Dashboard
  socket.on("join-event", (eventId) => {
    socket.join(eventId);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// ROUTES
// ==========================

// Module 1
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

// Module 2
app.use("/api/certificates", certificateRoutes);

// Module 3
app.use("/api/teams", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

// Module 4
app.use("/api/attendance", attendanceRoutes);

// ==========================
// TEST ROUTE
// ==========================
app.get("/", (req, res) => {
  res.send("CyberKavach API Running");
});

// ==========================
// DATABASE CONNECTION
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