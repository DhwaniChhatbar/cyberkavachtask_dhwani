import express from "express";

import {
  checkIn,
  checkOut,
  completeAttendance,
  getAttendanceByEvent,
  getDashboardStats,
  downloadAttendanceReport,
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
// CHECK-IN
// ==========================
router.post("/checkin", protect, checkIn);

// ==========================
// CHECK-OUT
// ==========================
router.post("/checkout", protect, checkOut);

// ==========================
// COMPLETE ATTENDANCE
// Awards points and badges
// ==========================
router.put(
  "/complete/:eventId",
  protect,
  completeAttendance
);

// ==========================
// ATTENDANCE DASHBOARD STATS
// ==========================
router.get(
  "/dashboard/:eventId",
  protect,
  getDashboardStats
);

// ==========================
// DOWNLOAD ATTENDANCE CSV REPORT
// ==========================
router.get(
  "/report/:eventId",
  protect,
  downloadAttendanceReport
);

// ==========================
// EVENT ATTENDANCE LIST
// ==========================
router.get(
  "/event/:eventId",
  protect,
  getAttendanceByEvent
);

export default router;