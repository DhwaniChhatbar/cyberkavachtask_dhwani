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
        message: "Event ID and Team ID or Member ID is required",
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
    // TEAM CHECK-IN
    // ======================


    // ======================
    // MEMBER CHECK-IN
    // ======================

    const team = await Team.findOne({
      event: eventId,
      "members.collegeId": collegeId.trim(),
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Member not registered for this event",
      });
    }

    const participant = team.members.find(
      (m) =>
        m.collegeId.trim().toUpperCase() ===
        collegeId.trim().toUpperCase()
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const existing = await Attendance.findOne({
      event: eventId,
      "participantDetails.collegeId": participant.collegeId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Member already checked in",
      });
    }

    const user = await User.findOne({
      collegeId: participant.collegeId,
    });

    const attendance = await Attendance.create({
      event: eventId,
      team: team._id,
      member: user?._id || null,
      checkInTime: new Date(),
      status: "checked-in",
      participantDetails: {
        fullName: participant.fullName,
        email: "",
        collegeId: participant.collegeId,
        department: participant.department,
        institute: participant.institute,
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
        message: "Event ID and Team ID or Member ID is required",
      });
    }

    const now = new Date();

    // ======================
    // TEAM CHECK-OUT
    // ======================


    // ======================
    // MEMBER CHECK-OUT
    // ======================

    const team = await Team.findOne({
      event: eventId,
      "members.collegeId": collegeId.trim(),
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Member not registered for this event",
      });
    }
    const participant = team.members.find(
      (m) =>
        m.collegeId.trim().toUpperCase() ===
        collegeId.trim().toUpperCase()
    );
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
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
        message: "Member already checked out",
      });
    }

    attendance.checkOutTime = now;

    attendance.durationMinutes = Math.floor(
      (now - attendance.checkInTime) / 60000
    );

    attendance.status = "checked-out";

    attendance.participantDetails = {
      fullName: participant.fullName,
      email: "",
      collegeId: participant.collegeId,
      department: participant.department,
      institute: participant.institute,
    };

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
      .populate("event", "name date")
      .populate("team", "teamName teamId")
      .populate("member", "name email collegeId department institute")
      .sort({ checkInTime: -1 });

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,

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

      team: record.team?.teamName || null,

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
            $add: [
              {
                $size: {
                  $ifNull: ["$members", []],
                },
              },
            ],
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

    const certificateGenerated = await Attendance.countDocuments({
      event: eventId,
      certificateGenerated: true,
    });

    const pointsAwarded = await Attendance.countDocuments({
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
// DOWNLOAD CSV REPORT
// ======================
export const downloadAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId,
    })
      .populate("event", "name")
      .populate("team", "teamName teamId")
      .populate("member", "name email collegeId department institute")
      .sort({ checkInTime: 1 });

    const data = attendance.map((record) => ({
      Event: record.event?.name || "Unknown",

      Team: record.team?.teamName || "",

      Name:
        record.participantDetails?.fullName ||
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
    res.attachment(
      `attendance-report-${req.params.eventId}.csv`
    );

    return res.send(csv);
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);

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

        // =========================
        // Individual Participant
        // =========================
        if (record.member && !record.pointsAwarded) {
          await Points.create({
            user: record.member._id || record.member,
            event: eventId,
            points: 10,
            category: "Participation",
            remarks: "Attendance completion reward",
            assignedBy: req.user.id,
          });

          await evaluateBadgesForUser(
            record.member._id || record.member,
            eventId
          );

          await Notification.create({
            recipient: record.member._id || record.member,
            message: "You received 10 points for attendance",
            type: "Event",
          });

          rewardsProcessed++;
        }

        // =========================
        // Team Participants
        // =========================
        if (record.team && !record.pointsAwarded) {
          for (const participant of record.team.members || []) {
            const user = await User.findOne({
              collegeId: participant.collegeId,
            });

            if (!user) continue;

            await Points.create({
              user: user._id,
              event: eventId,
              points: 10,
              category: "Participation",
              remarks: "Attendance completion reward",
              assignedBy: req.user.id,
            });

            await evaluateBadgesForUser(
              user._id,
              eventId
            );

            await Notification.create({
              recipient: user._id,
              message: "You received 10 points for attendance",
              type: "Event",
            });

            rewardsProcessed++;
          }
        }

        record.pointsAwarded = true;

        await record.save();
      } catch (err) {
        console.error("Reward Error:", err.message);
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
    const userId = req.user.id;

    const attendance = await Attendance.find({
      member: userId,
    })
      .populate("event", "name date")
      .populate("team", "teamName teamId")
      .populate("member", "name email collegeId department institute")
      .sort({ checkInTime: -1 });

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,

      event: record.event,

      team: record.team?.teamName || null,

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
    console.error("GET MY ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};