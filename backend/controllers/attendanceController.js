import Attendance from "../models/Attendance.js";
import Event from "../models/Event.js";
import Points from "../models/Points.js";
import UserBadge from "../models/UserBadge.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { io } from "../server.js";
import { generateAttendanceCSV } from "../utils/attendanceReport.js";
import { evaluateBadgesForUser } from "../utils/badgeEngine.js";

export const checkIn = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    // ======================
    // AUTH CHECK
    // ======================
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

    if (!eventId || (!teamId && !memberId)) {
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

        // ✅ REQUIRED FIX (schema fix)
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

    // ======================
    // MEMBER CHECK-IN (collegeId based)
    // ======================
    const user = await User.findOne({
      collegeId: memberId.trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const existingAttendance = await Attendance.findOne({
      event: eventId,
      member: user._id,
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
      member: user._id,
      checkInTime: new Date(),
      status: "checked-in",

      // ✅ REQUIRED FIX (THIS WAS CAUSING YOUR ERROR)
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const checkOut = async (req, res) => {
  try {
    const { eventId, teamId, memberId } = req.body;

    // ======================
    // AUTH CHECK
    // ======================
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

    if (!eventId || (!teamId && !memberId)) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Team ID or Member ID is required",
      });
    }

    const now = new Date();

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

      attendance.checkOutTime = now;

      attendance.durationMinutes = Math.floor(
        (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60)
      );

      attendance.status = "checked-out";

      // (optional but safe for schema consistency)
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

    // ======================
    // MEMBER CHECK OUT (collegeId based)
    // ======================
    const user = await User.findOne({
      collegeId: memberId.trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const attendance = await Attendance.findOne({
      event: eventId,
      member: user._id,
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

    attendance.checkOutTime = now;

    attendance.durationMinutes = Math.floor(
      (attendance.checkOutTime - attendance.checkInTime) / (1000 * 60)
    );

    attendance.status = "checked-out";

    // (safe fix for schema consistency)
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
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
      id: record._id,

      // ======================
      // UNIFIED PARTICIPANT DATA
      // ======================
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

      team: record.team?.teamName || "N/A",

      event: record.event,

      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      durationMinutes: record.durationMinutes,

      status: record.status,

      lateFlag: record.lateFlag,
      earlyExitFlag: record.earlyExitFlag,
      certificateGenerated: record.certificateGenerated,
      pointsAwarded: record.pointsAwarded,
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
export const downloadAttendanceReport = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      event: req.params.eventId,
    })
      .populate("event", "name")
      .populate("team", "teamName teamId members")
      .populate("member", "name email collegeId department institute")
      .sort({ checkInTime: 1 });

    const data = attendance.map((record) => ({
      Event: record.event?.name || "Unknown",
      Type: record.team ? "Team" : "Individual",

      // ======================
      // UNIFIED IDENTITY SYSTEM
      // ======================
      Name:
        record.participantDetails?.fullName ||
        record.member?.name ||
        record.team?.teamName ||
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
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

        // ======================
        // SAFE DURATION CALC
        // ======================
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

        // ======================
        // INDIVIDUAL USER
        // ======================
        const userId =
          record.member?._id || record.member;

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

          io?.to(userId.toString()).emit("points:update", {
            userId,
            points: 10,
          });

          record.pointsAwarded = true;
          rewardsProcessed++;
        }

        // ======================
        // TEAM USERS (SAFE LOOP)
        // ======================
        if (record.team && !record.pointsAwarded) {
          const members = record.team.members || [];

          for (const m of members) {
            const memberUser =
              typeof m === "object" ? m.user : m;

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

            io?.to(memberUser.toString()).emit("points:update", {
              userId: memberUser,
              points: 10,
            });

            rewardsProcessed++;
          }

          record.pointsAwarded = true;
        }

        // ======================
        // SAVE RECORD
        // ======================
        await record.save();
      } catch (err) {
        console.error("REWARD ERROR:", err.message);
      }
    }

    const event = await Event.findById(eventId);

    if (event) {
      event.attendanceCompleted = true;
      await event.save();
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

      // ======================
      // UNIFIED DISPLAY (COLLEGE-ID SYSTEM SAFE)
      // ======================
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

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};