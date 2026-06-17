import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import Points from "../models/Points.js";
import UserBadge from "../models/UserBadge.js";
import Notification from "../models/Notification.js";

import { io } from "../server.js";
import { generateAttendanceCSV } from "../utils/attendanceReport.js";
import { evaluateBadgesForUser } from "../utils/badgeEngine.js";

// ======================
// CHECK IN
// ======================
export const checkIn = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    if (!eventId || (!teamId && !memberId)) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Team ID/Member ID are required",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.status !== "Published") {
      return res.status(403).json({
        success: false,
        message: "Event is not active for attendance",
      });
    }

    const existingAttendance = await Attendance.findOne({
      event: eventId,
      ...(teamId ? { team: teamId } : { member: memberId }),
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
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

    io.to(eventId).emit("attendance:checkin", {
      type: "CHECKIN",
      data: attendance,
    });

    return res.status(201).json({
      success: true,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
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
        success: false,
        message: "Attendance record not found",
      });
    }

    if (attendance.status === "checked-out") {
      return res.status(400).json({
        success: false,
        message: "Already checked out",
      });
    }

    attendance.checkOutTime = new Date();
    attendance.status = "checked-out";

    await attendance.save();

    io.to(eventId).emit("attendance:checkout", {
      type: "CHECKOUT",
      data: attendance,
    });

    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json(attendance);
  } catch (error) {
    return res.status(500).json({
      success: false,
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

    const total = await Attendance.countDocuments({ event: eventId });

    const checkedIn = await Attendance.countDocuments({
      event: eventId,
      status: "checked-in",
    });

    const checkedOut = await Attendance.countDocuments({
      event: eventId,
      status: "checked-out",
    });

    const pending = total - checkedIn - checkedOut;

    return res.status(200).json({
      total,
      checkedIn,
      checkedOut,
      pending,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// DOWNLOAD CSV REPORT
// ======================
export const downloadAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId,
    })
      .populate("team")
      .populate("member");

    const data = attendance.map((a) => ({
      name: a.team?.teamName || a.member?.name || "Unknown",
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      status: a.status,
    }));

    const csv = generateAttendanceCSV(data);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance-report.csv");

    return res.send(csv);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// COMPLETE ATTENDANCE (FINAL PIPELINE)
// ======================
export const completeAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendanceList = await Attendance.find({ event: eventId });

    if (!attendanceList.length) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found",
      });
    }

    for (const record of attendanceList) {
      if (!record.member || record.pointsAwarded) continue;

      try {
        // 1. POINTS
        await Points.create({
          user: record.member,
          event: eventId,
          points: 10,
          category: "Participation",
          remarks: "Attendance completion reward",
          assignedBy: req.user.id,
        });

        record.pointsAwarded = true;
        await record.save();

        // 2. BADGES
        await evaluateBadgesForUser(record.member, eventId);

        // 3. NOTIFICATIONS
        await Notification.create({
          recipient: record.member,
          message: "You received 10 points for attendance",
          type: "Event",
        });

        // 4. SOCKET UPDATE
        io.to(record.member.toString()).emit("points:update", {
          userId: record.member,
          points: 10,
        });
      } catch (err) {
        console.error("Reward error:", err.message);
      }
    }

    io.to(eventId).emit("attendance:completed", {
      eventId,
      totalCount: attendanceList.length,
    });

    return res.status(200).json({
      success: true,
      message: "Attendance completed successfully",
      totalCount: attendanceList.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};