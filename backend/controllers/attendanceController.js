import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import Points from "../models/Points.js";
import UserBadge from "../models/UserBadge.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { io } from "../server.js";
import { generateAttendanceCSV } from "../utils/attendanceReport.js";
import { evaluateBadgesForUser } from "../utils/badgeEngine.js";

// ======================
// CHECK IN
// ======================
export const checkIn = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    // AUTH
    if (
      !["Faculty Coordinator", "Student Coordinator", "Tech Coordinator"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!eventId || (!teamId && !memberId)) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Team ID or Member ID is required",
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.status !== "Published") {
      return res.status(400).json({
        success: false,
        message: "Attendance is available only for published events",
      });
    }

    // ================= TEAM =================
    if (teamId) {
      const existing = await Attendance.findOne({ event: eventId, team: teamId });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Team already checked in",
        });
      }

      const attendance = await Attendance.create({
        event: eventId,
        team: teamId,
        member: null,
        checkInTime: new Date(),
        status: "checked-in",
        participantDetails: {
          fullName: "Team",
          email: "team@system",
          collegeId: teamId,
          department: "TEAM",
          institute: "TEAM",
        },
      });

      io?.to(eventId).emit("attendance:checkin", {
        type: "CHECKIN",
        data: attendance,
      });

      return res.status(201).json({
        success: true,
        message: "Team checked in successfully",
        attendance,
      });
    }

    // ================= MEMBER =================
    const user = await User.findOne({ collegeId: memberId.trim() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const existing = await Attendance.findOne({
      event: eventId,
      member: user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Member already checked in",
      });
    }

    const attendance = await Attendance.create({
      event: eventId,
      team: null,
      member: user._id,
      checkInTime: new Date(),
      status: "checked-in",
      participantDetails: {
        fullName: user.name,
        email: user.email,
        collegeId: user.collegeId,
        department: user.department,
        institute: user.institute,
      },
    });

    io?.to(eventId).emit("attendance:checkin", {
      type: "CHECKIN",
      data: attendance,
    });

    return res.status(201).json({
      success: true,
      message: "Member checked in successfully",
      attendance,
    });
  } catch (error) {
    console.error("CHECK IN ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// CHECK OUT
// ======================
export const checkOut = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    if (
      !["Faculty Coordinator", "Student Coordinator", "Tech Coordinator"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!eventId || (!teamId && !memberId)) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Team ID or Member ID is required",
      });
    }

    const now = new Date();

    // ================= TEAM =================
    if (teamId) {
      const attendance = await Attendance.findOne({ event: eventId, team: teamId });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: "Team attendance not found",
        });
      }

      if (attendance.checkOutTime) {
        return res.status(400).json({
          success: false,
          message: "Team already checked out",
        });
      }

      attendance.checkOutTime = now;
      attendance.durationMinutes = Math.floor(
        (now - attendance.checkInTime) / 60000
      );
      attendance.status = "checked-out";

      if (!attendance.participantDetails) {
        attendance.participantDetails = {
          fullName: "Team",
          email: "team@system",
          collegeId: teamId,
          department: "TEAM",
          institute: "TEAM",
        };
      }

      await attendance.save();

      io?.to(eventId).emit("attendance:checkout", {
        type: "CHECKOUT",
        data: attendance,
      });

      return res.status(200).json({
        success: true,
        message: "Team checked out successfully",
        attendance,
      });
    }

    // ================= MEMBER =================
    const user = await User.findOne({ collegeId: memberId.trim() });

    if (!user) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    const attendance = await Attendance.findOne({
      event: eventId,
      member: user._id,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Already checked out",
      });
    }

    attendance.checkOutTime = now;
    attendance.durationMinutes = Math.floor(
      (now - attendance.checkInTime) / 60000
    );
    attendance.status = "checked-out";

    if (!attendance.participantDetails) {
      attendance.participantDetails = {
        fullName: user.name,
        email: user.email,
        collegeId: user.collegeId,
        department: user.department,
        institute: user.institute,
      };
    }

    await attendance.save();

    io?.to(eventId).emit("attendance:checkout", {
      type: "CHECKOUT",
      data: attendance,
    });

    return res.status(200).json({
      success: true,
      message: "Member checked out successfully",
      attendance,
    });
  } catch (error) {
    console.error("CHECK OUT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
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
      .populate("event", "name date")
      .populate("team", "teamName teamId members")
      .populate("member", "name email collegeId department institute")
      .sort({ checkInTime: -1 });

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,

      // ======================
      // UNIFIED IDENTITY SYSTEM (FIXED)
      // ======================
      fullName:
        record.participantDetails?.fullName ||
        record.member?.name ||
        record.team?.teamName ||
        "N/A",

      email:
        record.participantDetails?.email ||
        record.member?.email ||
        "N/A",

      collegeId:
        record.participantDetails?.collegeId ||
        record.member?.collegeId ||
        "N/A",

      department:
        record.participantDetails?.department ||
        record.member?.department ||
        "N/A",

      institute:
        record.participantDetails?.institute ||
        record.member?.institute ||
        "N/A",

      team: record.team?.teamName || "N/A",

      event: record.event,

      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      durationMinutes: record.durationMinutes || 0,

      status: record.status,

      lateFlag: record.lateFlag || false,
      earlyExitFlag: record.earlyExitFlag || false,
      certificateGenerated: record.certificateGenerated || false,
      pointsAwarded: record.pointsAwarded || false,
    }));

    return res.status(200).json({
      success: true,
      count: formattedAttendance.length,
      attendance: formattedAttendance,
    });
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================
// DASHBOARD STATS
// ======================
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const total = await Attendance.countDocuments({ event: eventId });

    const event = await Event.findById(eventId);
    const registrationCount = event?.registrations?.length || 0;

    const checkedIn = await Attendance.countDocuments({
      event: eventId,
      status: "checked-in",
    });

    const checkedOut = await Attendance.countDocuments({
      event: eventId,
      status: "checked-out",
    });

    const completed = await Attendance.countDocuments({
      event: eventId,
      status: "completed",
    });

    const late = await Attendance.countDocuments({
      event: eventId,
      lateFlag: true,
    });

    const earlyExit = await Attendance.countDocuments({
      event: eventId,
      earlyExitFlag: true,
    });

    const certificateGenerated = await Attendance.countDocuments({
      event: eventId,
      certificateGenerated: true,
    });

    const pointsAwarded = await Attendance.countDocuments({
      event: eventId,
      pointsAwarded: true,
    });

    // ======================
    // SAFE AVERAGE CALCULATION
    // ======================
    const avg = await Attendance.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: "$durationMinutes" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      total,
      registrationCount,
      checkedIn,
      checkedOut,
      completed,
      late,
      earlyExit,
      certificateGenerated,
      pointsAwarded,
      averageDuration: avg[0]?.avgDuration
        ? Math.round(avg[0].avgDuration)
        : 0,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
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
      .populate("event", "name")
      .populate("team", "teamName teamId members")
      .populate("member", "name email collegeId")
      .sort({ checkInTime: 1 });

    const data = attendance.map((record) => ({
      Event: record.event?.name || "Unknown",
      Type: record.team ? "Team" : "Individual",

      Name:
        record.participantDetails?.fullName ||
        record.team?.teamName ||
        record.member?.name ||
        "Unknown",

      Email:
        record.participantDetails?.email ||
        record.member?.email ||
        "",

      CollegeId:
        record.participantDetails?.collegeId ||
        record.member?.collegeId ||
        "",

      Department:
        record.participantDetails?.department ||
        record.member?.department ||
        "",

      Institute:
        record.participantDetails?.institute ||
        record.member?.institute ||
        "",

      CheckInTime: record.checkInTime
        ? new Date(record.checkInTime).toLocaleString()
        : "",

      CheckOutTime: record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleString()
        : "",

      DurationMinutes: record.durationMinutes || 0,
      Status: record.status,

      Late: record.lateFlag ? "Yes" : "No",
      EarlyExit: record.earlyExitFlag ? "Yes" : "No",
      CertificateGenerated: record.certificateGenerated ? "Yes" : "No",
      PointsAwarded: record.pointsAwarded ? "Yes" : "No",
    }));

    const csv = generateAttendanceCSV(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`attendance-report-${req.params.eventId}.csv`);

    return res.send(csv);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// ======================
// COMPLETE ATTENDANCE
// ======================
export const completeAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendanceList = await Attendance.find({ event: eventId })
      .populate("team")
      .populate("member");

    if (!attendanceList.length) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found",
      });
    }

    let rewardsProcessed = 0;

    for (const record of attendanceList) {
      try {
        record.status = "completed";

        if (
          record.checkInTime &&
          record.checkOutTime &&
          !record.durationMinutes
        ) {
          record.durationMinutes = Math.floor(
            (record.checkOutTime - record.checkInTime) / 60000
          );
        }

        const userId = record.member?._id || record.member;

        if (userId && !record.pointsAwarded) {
          await Points.create({
            user: userId,
            event: eventId,
            points: 10,
            category: "Participation",
            remarks: "Attendance completion reward",
            assignedBy: req.user.id,
          });

          await evaluateBadgesForUser(userId, eventId);

          await Notification.create({
            recipient: userId,
            message: "You received 10 points for attendance",
            type: "Event",
          });

          record.pointsAwarded = true;
          rewardsProcessed++;
        }

        if (record.team && !record.pointsAwarded) {
          const members = record.team.members || [];

          for (const m of members) {
            const memberUser = typeof m === "object" ? m.user : m;

            if (!memberUser) continue;

            await Points.create({
              user: memberUser,
              event: eventId,
              points: 10,
              category: "Participation",
              remarks: "Attendance completion reward",
              assignedBy: req.user.id,
            });

            await evaluateBadgesForUser(memberUser, eventId);

            await Notification.create({
              recipient: memberUser,
              message: "You received 10 points for attendance",
              type: "Event",
            });

            rewardsProcessed++;
          }

          record.pointsAwarded = true;
        }

        await record.save();
      } catch (err) {
        console.error("REWARD ERROR:", err.message);
      }
    }

    await Event.findByIdAndUpdate(eventId, {
      attendanceCompleted: true,
    });

    io?.to(eventId).emit("attendance:completed", {
      eventId,
      totalCount: attendanceList.length,
    });

    return res.status(200).json({
      success: true,
      message: "Attendance completed successfully",
      totalAttendanceRecords: attendanceList.length,
      rewardsProcessed,
    });
  } catch (error) {
    console.error("COMPLETE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// ======================
// GET MY ATTENDANCE
// ======================
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const attendance = await Attendance.find({
      $or: [
        { member: userId },
        { "participantDetails.userId": userId },
      ],
    })
      .populate("event", "name date")
      .populate("team", "teamName teamId")
      .sort({ createdAt: -1 });

    const formatted = attendance.map((record) => ({
      id: record._id,
      event: record.event,
      team: record.team?.teamName || null,
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      durationMinutes: record.durationMinutes || 0,

      fullName:
        record.participantDetails?.fullName ||
        record.member?.name ||
        "N/A",

      email:
        record.participantDetails?.email ||
        record.member?.email ||
        "N/A",

      collegeId:
        record.participantDetails?.collegeId ||
        record.member?.collegeId ||
        "N/A",

      department:
        record.participantDetails?.department ||
        record.member?.department ||
        "N/A",

      institute:
        record.participantDetails?.institute ||
        record.member?.institute ||
        "N/A",
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      attendance: formatted,
    });
  } catch (error) {
    console.error("GET MY ATTENDANCE ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};