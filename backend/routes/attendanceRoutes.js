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
// ==========================
router.get("/my", protect, getMyAttendance);

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
// ==========================
router.put("/complete/:eventId", protect, completeAttendance);

// ==========================
// DASHBOARD STATS
// ==========================
router.get("/dashboard/:eventId", protect, getDashboardStats);

// ==========================
// DOWNLOAD ATTENDANCE REPORT
// Only Coordinators can export CSV
// ==========================
router.get(
  "/report/:eventId",
  protect,
  (req, res, next) => {
    const allowedRoles = [
      "Faculty Coordinator",
      "Student Coordinator",
      "Tech Coordinator",
    ];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  },
  downloadAttendanceReport
);

// ==========================
// EVENT ATTENDANCE LIST
// ==========================
router.get("/event/:eventId", protect, getAttendanceByEvent);

export default router;