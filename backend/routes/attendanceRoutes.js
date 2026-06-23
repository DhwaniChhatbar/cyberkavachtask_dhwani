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
// Supports team attendance
// Supports individual attendance
// ==========================
router.post("/checkin", protect, checkIn);

// ==========================
// CHECK-OUT
// Supports team attendance
// Supports individual attendance
// ==========================
router.post("/checkout", protect, checkOut);

// ==========================
// COMPLETE ATTENDANCE
// Awards points + badges
// ==========================
router.put(
  "/complete/:eventId",
  protect,
  completeAttendance
);

// ==========================
// DASHBOARD STATS
// ==========================
router.get(
  "/dashboard/:eventId",
  protect,
  getDashboardStats
);

// ==========================
// DOWNLOAD CSV REPORT
// ==========================
router.get(
  "/report/:eventId",
  protect,
  downloadAttendanceReport
);

// ==========================
// GET ALL ATTENDANCE FOR EVENT
// ==========================
router.get(
  "/event/:eventId",
  protect,
  getAttendanceByEvent
);

export default router;