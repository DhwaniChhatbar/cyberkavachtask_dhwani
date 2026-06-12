import Attendance from "../models/Attendance.js";
import { io } from "../server.js";

// ======================
// CHECK IN
// ======================
export const checkIn = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    if (!eventId || (!teamId && !memberId)) {
      return res.status(400).json({
        message: "Event ID and Team ID/Member ID are required",
      });
    }

    // Prevent duplicate check-in
    const existingAttendance = await Attendance.findOne({
      event: eventId,
      ...(teamId ? { team: teamId } : { member: memberId }),
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Already checked in",
      });
    }

    const attendance = await Attendance.create({
      event: eventId,
      team: teamId || null,
      member: memberId || null,
      checkInTime: new Date(),
      status: "checked-in",
    });

    // Live dashboard update
    io.to(eventId).emit("checkin", attendance);

    res.status(201).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// CHECK OUT
// ======================
export const checkOut = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    const attendance = await Attendance.findOne({
      event: eventId,
      ...(teamId ? { team: teamId } : { member: memberId }),
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    attendance.checkOutTime = new Date();
    attendance.status = "checked-out";

    await attendance.save();

    io.to(eventId).emit("checkout", attendance);

    res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET ATTENDANCE LIST
// ======================
export const getAttendanceByEvent = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId,
    })
      .populate("team")
      .populate("member");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================
// DASHBOARD STATS
// ======================
export const getDashboardStats = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const total = await Attendance.countDocuments({
      event: eventId,
    });

    const checkedIn = await Attendance.countDocuments({
      event: eventId,
      status: "checked-in",
    });

    const checkedOut = await Attendance.countDocuments({
      event: eventId,
      status: "checked-out",
    });

    const pending = total - checkedIn - checkedOut;

    res.status(200).json({
      total,
      checkedIn,
      checkedOut,
      pending,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};