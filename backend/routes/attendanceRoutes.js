import express from "express";
import {
  checkIn,
  checkOut,
  getAttendanceByEvent,
  getDashboardStats,
} from "../controllers/attendanceController.js";

const router = express.Router();

// TEST
router.get("/test", (req, res) => {
  res.json({ message: "Attendance routes working" });
});

// CHECK-IN
router.post("/checkin", checkIn);

// CHECK-OUT
router.post("/checkout", checkOut);

// DASHBOARD
router.get("/dashboard/:eventId", getDashboardStats);

// EVENT ATTENDANCE LIST
router.get("/event/:eventId", getAttendanceByEvent);

export default router;