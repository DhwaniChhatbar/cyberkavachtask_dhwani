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
// ROLE CHECK MIDDLEWARE
// ==========================
const allowRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }
    next();
  };
};

// Allowed coordinator roles
const COORDINATORS = [
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
];

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
// MEMBER ATTENDANCE HISTORY (only logged-in user)
// ==========================
router.get("/my", protect, getMyAttendance);

// ==========================
// CHECK-IN (Students / Members only)
// ==========================
router.post(
  "/checkin",
  protect,
  allowRoles(["Student", "Member"]),
  checkIn
);

// ==========================
// CHECK-OUT (Students / Members only)
// ==========================
router.post(
  "/checkout",
  protect,
  allowRoles(["Student", "Member"]),
  checkOut
);

// ==========================
// COMPLETE ATTENDANCE (Coordinators only)
// ==========================
router.put(
  "/complete/:eventId",
  protect,
  allowRoles(COORDINATORS),
  completeAttendance
);

// ==========================
// DASHBOARD STATS (Coordinators only)
// ==========================
router.get(
  "/dashboard/:eventId",
  protect,
  allowRoles(COORDINATORS),
  getDashboardStats
);

// ==========================
// DOWNLOAD ATTENDANCE REPORT (Coordinators only)
// ==========================
router.get(
  "/report/:eventId",
  protect,
  allowRoles(COORDINATORS),
  downloadAttendanceReport
);

// ==========================
// EVENT ATTENDANCE LIST (Coordinators only)
// ==========================
router.get(
  "/event/:eventId",
  protect,
  allowRoles(COORDINATORS),
  getAttendanceByEvent
);

export default router;