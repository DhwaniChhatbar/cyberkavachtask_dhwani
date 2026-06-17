import User from "../models/User.js";
import Event from "../models/Event.js";
import Request from "../models/Request.js";
import Certificate from "../models/Certificate.js";
import Attendance from "../models/Attendance.js";
import Points from "../models/Points.js";
import UserBadge from "../models/UserBadge.js";

import { generateCSV } from "../utils/generateCSV.js";
import { generatePDF } from "../utils/generatePDF.js";

/**
 * ==========================
 * MODULE 6 - ANALYTICS DASHBOARD
 * ==========================
 */
export const getAnalytics = async (req, res) => {
  try {
    // USERS
    const totalUsers = await User.countDocuments();

    const roleStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // EVENTS
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({
      status: "Published",
    });
    const draftEvents = await Event.countDocuments({
      status: "Draft",
    });

    // REQUESTS
    const requestStats = await Request.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await Request.countDocuments();

    // CERTIFICATES
    const totalCertificates = await Certificate.countDocuments();

    // ATTENDANCE
    const totalAttendanceRecords = await Attendance.countDocuments();

    // REWARDS (POINTS + BADGES)
    const totalPointsAgg = await Points.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$points" },
        },
      },
    ]);

    const totalBadges = await UserBadge.countDocuments();

    return res.status(200).json({
      success: true,
      users: {
        totalUsers,
        roleStats,
      },

      events: {
        totalEvents,
        publishedEvents,
        draftEvents,
      },

      requests: {
        totalRequests,
        requestStats,
      },

      certificates: {
        totalCertificates,
      },

      attendance: {
        totalAttendanceRecords,
      },

      rewards: {
        totalPoints: totalPointsAgg[0]?.total || 0,
        totalBadges,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

/**
 * ==========================
 * EXPORT CSV
 * ==========================
 */
export const exportCSV = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalEvents: await Event.countDocuments(),
      totalRequests: await Request.countDocuments(),
      totalCertificates: await Certificate.countDocuments(),
      totalAttendanceRecords: await Attendance.countDocuments(),
    };

    const data = Object.entries(stats).map(([key, value]) => ({
      Metric: key,
      Value: value,
    }));

    return generateCSV(data, res);
  } catch (error) {
    console.error("CSV Export Error:", error);

    return res.status(500).json({
      success: false,
      message: "CSV export failed",
    });
  }
};

/**
 * ==========================
 * EXPORT PDF
 * ==========================
 */
export const exportPDF = async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalEvents: await Event.countDocuments(),
      totalRequests: await Request.countDocuments(),
      totalCertificates: await Certificate.countDocuments(),
      totalAttendanceRecords: await Attendance.countDocuments(),
    };

    return generatePDF(stats, res);
  } catch (error) {
    console.error("PDF Export Error:", error);

    return res.status(500).json({
      success: false,
      message: "PDF export failed",
    });
  }
};