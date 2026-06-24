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

    const userId = memberId || req.user?.id;

    if (!eventId || (!teamId && !userId)) {
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
    // TEAM ATTENDANCE
    // ======================
    if (teamId) {
      const existingAttendance = await Attendance.findOne({
        event: eventId,
        team: teamId,
      });

      if (existingAttendance) {
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

    // ======================
    // MEMBER ATTENDANCE
    // ======================
    const existingAttendance = await Attendance.findOne({
      event: eventId,
      member: userId,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Member already checked in",
      });
    }

    const attendance = await Attendance.create({
      event: eventId,
      team: null,
      member: userId,
      checkInTime: new Date(),
      status: "checked-in",
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
    const { eventId, teamId, memberId } = req.body;

    const userId = memberId || req.user?.id;

    if (!eventId || (!teamId && !userId)) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Team ID or Member ID is required",
      });
    }

    // ======================
    // TEAM CHECK OUT
    // ======================
    if (teamId) {
      const attendance = await Attendance.findOne({
        event: eventId,
        team: teamId,
      });

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: "Team attendance record not found",
        });
      }

      if (attendance.checkOutTime) {
        return res.status(400).json({
          success: false,
          message: "Team already checked out",
        });
      }

      attendance.checkOutTime = new Date();

      const duration = Math.floor(
        (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60)
      ) || 0;

      attendance.durationMinutes = duration;
      attendance.status = "checked-out";

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

    // ======================
    // MEMBER CHECK OUT
    // ======================
    const attendance = await Attendance.findOne({
      event: eventId,
      member: userId,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Member attendance record not found",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Member already checked out",
      });
    }

    attendance.checkOutTime = new Date();

    const duration = Math.floor(
      (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60)
    ) || 0;

    attendance.durationMinutes = duration;
    attendance.status = "checked-out";

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
      .populate("team", "teamName teamId members")
      .populate("member", "name email")
      .sort({ checkInTime: -1 });

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,
      event: record.event,
      team: record.team,
      member: record.member,

      attendeeName:
        record.team?.teamName ||
        record.member?.name ||
        "Unknown",

      attendeeEmail: record.member?.email || "",

      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      durationMinutes: record.durationMinutes,

      status: record.status,
      lateFlag: record.lateFlag,
      earlyExitFlag: record.earlyExitFlag,
      certificateGenerated: record.certificateGenerated,
      pointsAwarded: record.pointsAwarded,

      createdAt: record.createdAt,
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

    const total = await Attendance.countDocuments({ event: eventId });

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
      { $match: { event: eventId } },
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
      .populate("team", "teamName teamId")
      .populate("member", "name email")
      .sort({ checkInTime: 1 });

    const data = attendance.map((record) => ({
      Event: record.event?.name || "Unknown",
      Type: record.team ? "Team" : "Individual",
      Name:
        record.team?.teamName ||
        record.member?.name ||
        "Unknown",
      Email: record.member?.email || "",
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
    }).populate("team member");

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
            (new Date(record.checkOutTime) -
              new Date(record.checkInTime)) /
              (1000 * 60)
          );
        }

        if (record.member && !record.pointsAwarded) {
          await Points.create({
            user: record.member,
            event: eventId,
            points: 10,
            category: "Participation",
            remarks: "Attendance completion reward",
            assignedBy: req.user.id,
          });

          await evaluateBadgesForUser(record.member, eventId);

          await Notification.create({
            recipient: record.member,
            message: "You received 10 points for attendance",
            type: "Event",
          });

          io?.to(record.member.toString()).emit("points:update", {
            userId: record.member,
            points: 10,
          });

          record.pointsAwarded = true;
          rewardsProcessed++;
        }

        if (record.team && !record.pointsAwarded) {
          const members = record.team.members || [];

          for (const member of members) {
            if (!member.user) continue;

            await Points.create({
              user: member.user,
              event: eventId,
              points: 10,
              category: "Participation",
              remarks: "Attendance completion reward",
              assignedBy: req.user.id,
            });

            await evaluateBadgesForUser(member.user, eventId);

            await Notification.create({
              recipient: member.user,
              message: "You received 10 points for attendance",
              type: "Event",
            });

            io?.to(member.user.toString()).emit("points:update", {
              userId: member.user,
              points: 10,
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
    const attendance = await Attendance.find({
      member: req.user.id,
    })
      .populate("event", "name date")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("GET MY ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};