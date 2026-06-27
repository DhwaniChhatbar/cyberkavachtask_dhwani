import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import Team from "../models/Team.js";
import User from "../models/User.js";
import Points from "../models/Points.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

import { io } from "../server.js";
import { generateAttendanceCSV } from "../utils/attendanceReport.js";
import { evaluateBadgesForUser } from "../utils/badgeEngine.js";

// ======================
// CHECK IN
// ======================
export const checkIn = async (req, res) => {
  try {
    const { eventId, collegeId } = req.body;

    if (
      ![
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
      ].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!eventId || !collegeId) {
      return res.status(400).json({
        success: false,
        message: "Event ID and College ID are required",
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
      return res.status(400).json({
        success: false,
        message: "Attendance is available only for published events",
      });
    }

    // ======================
    // FIND PARTICIPANT
    // ======================
    const team = await Team.findOne({
      event: eventId,
      "members.collegeId": collegeId.trim(),
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Participant not registered for this event",
      });
    }

    const participant = team.members.find(
      (member) =>
        member.collegeId.trim().toUpperCase() ===
        collegeId.trim().toUpperCase()
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    // ======================
    // ALREADY CHECKED IN?
    // ======================
    const existingAttendance = await Attendance.findOne({
      event: eventId,
      "participantDetails.collegeId": participant.collegeId,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Participant already checked in",
      });
    }

    // ======================
    // FIND USER (OPTIONAL)
    // ======================
    const user = await User.findOne({
      collegeId: participant.collegeId,
    });

    // ======================
    // CREATE ATTENDANCE
    // ======================
    const attendance = await Attendance.create({
      event: eventId,
      team: team._id,
      member: user ? user._id : null,

      participantDetails: {
        fullName: participant.fullName,
        collegeId: participant.collegeId,
        department: participant.department,
        institute: participant.institute,
      },

      checkInTime: new Date(),
      status: "checked-in",
    });

    // ======================
    // SOCKET EVENT
    // ======================
    io.to(eventId).emit("attendance:checkin", attendance);

    return res.status(201).json({
      success: true,
      message: "Participant checked in successfully",
      attendance,
    });
  } catch (error) {
    console.error("CHECK IN ERROR:", error);

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
    const { eventId, collegeId } = req.body;

    if (
      ![
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
      ].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!eventId || !collegeId) {
      return res.status(400).json({
        success: false,
        message: "Event ID and College ID are required",
      });
    }

    const team = await Team.findOne({
      event: eventId,
      "members.collegeId": collegeId.trim(),
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Participant not registered for this event",
      });
    }

    const participant = team.members.find(
      (member) =>
        member.collegeId.trim().toUpperCase() ===
        collegeId.trim().toUpperCase()
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    const attendance = await Attendance.findOne({
      event: eventId,
      "participantDetails.collegeId": participant.collegeId,
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
        message: "Participant already checked out",
      });
    }

    const now = new Date();

    attendance.checkOutTime = now;

    attendance.durationMinutes = Math.floor(
      (now.getTime() - attendance.checkInTime.getTime()) / 60000
    );

    attendance.status = "checked-out";

    attendance.participantDetails = {
      fullName: participant.fullName,
      collegeId: participant.collegeId,
      department: participant.department,
      institute: participant.institute,
    };

    await attendance.save();

    io.to(eventId).emit("attendance:checkout", attendance);

    return res.status(200).json({
      success: true,
      message: "Participant checked out successfully",
      attendance,
    });
  } catch (error) {
    console.error("CHECK OUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================
// GET ATTENDANCE BY EVENT
// ======================
export const getAttendanceByEvent = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId,
    })
      .populate("event", "name date")
      .populate("team", "teamName teamId")
      .populate("member", "name collegeId department institute")
      .sort({ checkInTime: -1 });

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,

      fullName:
        record.participantDetails?.fullName ||
        record.member?.name ||
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

      team: record.team?.teamName || "",

      event: record.event,

      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,

      durationMinutes: record.durationMinutes || 0,

      status: record.status,

      lateFlag: record.lateFlag || false,
      earlyExitFlag: record.earlyExitFlag || false,
      certificateGenerated:
        record.certificateGenerated || false,
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
export const getDashboardStats = async (req, res) => {
  try {
    const { eventId } = req.params;

    const total = await Attendance.countDocuments({
      event: eventId,
    });

    const registrationCount = await Team.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $project: {
          totalMembers: {
            $size: {
              $ifNull: ["$members", []],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalMembers",
          },
        },
      },
    ]);

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

    const certificateGenerated =
      await Attendance.countDocuments({
        event: eventId,
        certificateGenerated: true,
      });

    const pointsAwarded =
      await Attendance.countDocuments({
        event: eventId,
        pointsAwarded: true,
      });

    const avg = await Attendance.aggregate([
      {
        $match: {
          event: new mongoose.Types.ObjectId(eventId),
        },
      },
      {
        $group: {
          _id: null,
          avgDuration: {
            $avg: "$durationMinutes",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,

      total,

      registrationCount:
        registrationCount.length > 0
          ? registrationCount[0].total
          : 0,

      checkedIn,
      checkedOut,
      completed,

      late,
      earlyExit,

      certificateGenerated,
      pointsAwarded,

      averageDuration:
        avg.length > 0
          ? Math.round(avg[0].avgDuration || 0)
          : 0,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================
// DOWNLOAD ATTENDANCE REPORT
// ======================
export const downloadAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId,
    })
      .populate("event", "name")
      .populate("team", "teamName teamId")
      .populate("member", "name collegeId department institute")
      .sort({ checkInTime: 1 });

    const data = attendance.map((record) => ({
      name:
        record.participantDetails?.fullName ||
        record.member?.name ||
        "Unknown",

      team:
        record.team?.teamName || "",

      event:
        record.event?.name || "Unknown",

      checkInTime: record.checkInTime
        ? new Date(record.checkInTime).toLocaleString()
        : "",

      checkOutTime: record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleString()
        : "",

      durationMinutes:
        record.durationMinutes || 0,

      status:
        record.status || "",

      lateFlag:
        record.lateFlag || false,

      earlyExitFlag:
        record.earlyExitFlag || false,

      certificateGenerated:
        record.certificateGenerated || false,

      pointsAwarded:
        record.pointsAwarded || false,
    }));

    const csv = generateAttendanceCSV(data);

    res.header("Content-Type", "text/csv");
    res.attachment(
      `attendance-report-${req.params.eventId}.csv`
    );

    return res.send(csv);
  } catch (error) {
    console.error(
      "DOWNLOAD REPORT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================
// COMPLETE ATTENDANCE
// ======================
export const completeAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendanceList = await Attendance.find({
      event: eventId,
    })
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
        // Already completed
        if (record.pointsAwarded) {
          record.status = "completed";
          await record.save();
          continue;
        }

        record.status = "completed";

        // Calculate duration if missing
        if (
          record.checkInTime &&
          record.checkOutTime &&
          !record.durationMinutes
        ) {
          record.durationMinutes = Math.floor(
            (record.checkOutTime.getTime() -
              record.checkInTime.getTime()) /
              60000
          );
        }

        // ==========================
        // GIVE POINTS TO PARTICIPANT
        // ==========================
        if (record.member) {
          await Points.create({
            user: record.member._id,
            event: eventId,
            points: 10,
            category: "Participation",
            remarks: "Attendance completed",
            assignedBy: req.user.id,
          });

          await evaluateBadgesForUser(
            record.member._id,
            eventId
          );

          await Notification.create({
            recipient: record.member._id,
            message:
              "You earned 10 participation points.",
            type: "Points",
          });

          rewardsProcessed++;
        }

        record.pointsAwarded = true;

        await record.save();
      } catch (err) {
        console.error(
          "Reward Processing Error:",
          err.message
        );
      }
    }

    // ==========================
    // MARK EVENT COMPLETED
    // ==========================
    await Event.findByIdAndUpdate(eventId, {
      attendanceCompleted: true,
    });

    // ==========================
    // SOCKET UPDATE
    // ==========================
    io.to(eventId).emit(
      "attendance:completed",
      {
        eventId,
        totalAttendance:
          attendanceList.length,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Attendance completed successfully",
      totalAttendanceRecords:
        attendanceList.length,
      rewardsProcessed,
    });
  } catch (error) {
    console.error(
      "COMPLETE ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================
// GET MY ATTENDANCE
// ======================
export const getMyAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "collegeId"
    );

    if (!user || !user.collegeId) {
      return res.status(404).json({
        success: false,
        message: "College ID not found for user",
      });
    }

    const attendance = await Attendance.find({
      "participantDetails.collegeId": user.collegeId,
    })
      .populate("event", "name date")
      .populate("team", "teamName teamId")
      .sort({ checkInTime: -1 });

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,

      event: record.event,

      team: record.team?.teamName || "",

      fullName:
        record.participantDetails?.fullName || "N/A",

      collegeId:
        record.participantDetails?.collegeId || "N/A",

      department:
        record.participantDetails?.department || "N/A",

      institute:
        record.participantDetails?.institute || "N/A",

      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,

      durationMinutes:
        record.durationMinutes || 0,

      status: record.status,

      lateFlag:
        record.lateFlag || false,

      earlyExitFlag:
        record.earlyExitFlag || false,

      certificateGenerated:
        record.certificateGenerated || false,

      pointsAwarded:
        record.pointsAwarded || false,
    }));

    return res.status(200).json({
      success: true,
      count: formattedAttendance.length,
      attendance: formattedAttendance,
    });
  } catch (error) {
    console.error(
      "GET MY ATTENDANCE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};