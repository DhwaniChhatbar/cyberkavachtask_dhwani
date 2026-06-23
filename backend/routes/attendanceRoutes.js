import express from "express";
import {
  checkIn,
  checkOut,
  completeAttendance,
  getAttendanceByEvent,
  getDashboardStats,
  downloadAttendanceReport,
  getMyAttendance,
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// TEST ROUTE
// ==========================
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Attendance routes working",
  });
});

// ==========================
// MEMBER ATTENDANCE HISTORY
// (My Attendance - logged in user)
// ==========================
router.get("/my", protect, getMyAttendance);

// ==========================
// CHECK-IN ROUTE
// Supports both:
// - Individual attendance
// - Team attendance
// ==========================
router.post("/checkin", protect, checkIn);

// ==========================
// CHECK-OUT ROUTE
// Supports both:
// - Individual attendance
// - Team attendance
// ==========================
router.post("/checkout", protect, checkOut);

// ==========================
// COMPLETE ATTENDANCE PIPELINE
// - Marks attendance completed
// - Awards points
// - Triggers badge evaluation
// ==========================
router.put("/complete/:eventId", protect, completeAttendance);

// ==========================
// DASHBOARD STATS (EVENT LEVEL)
// - total attendance
// - checked-in
// - checked-out
// - completed
// - averages
// ==========================
router.get("/dashboard/:eventId", protect, getDashboardStats);

// ==========================
// DOWNLOAD ATTENDANCE REPORT (CSV)
// - exports event attendance data
// ==========================
router.get("/report/:eventId", protect, downloadAttendanceReport);

// ==========================
// EVENT ATTENDANCE LIST
// - full attendance list per event
// - admin / coordinator view
// ==========================
router.get("/event/:eventId", protect, getAttendanceByEvent);

export default router;