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

// ==========================
// COORDINATOR ROLES
// ==========================
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
// MY ATTENDANCE
// ==========================
router.get(
  "/my",
  protect,
  getMyAttendance
);

// ==========================
// CHECK IN
// ==========================
router.post(
  "/checkin",
  protect,
  allowRoles(COORDINATORS),
  checkIn
);

// ==========================
// CHECK OUT
// ==========================
router.post(
  "/checkout",
  protect,
  allowRoles(COORDINATORS),
  checkOut
);

// ==========================
// COMPLETE ATTENDANCE
// ==========================
router.put(
  "/complete/:eventId",
  protect,
  allowRoles(COORDINATORS),
  completeAttendance
);

// ==========================
// DASHBOARD STATS
// ==========================
router.get(
  "/dashboard/:eventId",
  protect,
  allowRoles(COORDINATORS),
  getDashboardStats
);

// ==========================
// DOWNLOAD REPORT
// ==========================
router.get(
  "/report/:eventId",
  protect,
  allowRoles(COORDINATORS),
  downloadAttendanceReport
);

// ==========================
// EVENT ATTENDANCE
// ==========================
router.get(
  "/event/:eventId",
  protect,
  allowRoles(COORDINATORS),
  getAttendanceByEvent
);

export default router;