import Attendance from "../models/Attendance.js";
import Certificate from "../models/Certificate.js";
import Event from "../models/Event.js";
import Points from "../models/Points.js";

// ==========================
// DASHBOARD STATS COLLECTOR
// ==========================
export const getPlatformStats = async () => {
  const totalEvents = await Event.countDocuments();

  const totalCertificates = await Certificate.countDocuments();

  const totalAttendance = await Attendance.countDocuments();

  const totalPoints = await Points.countDocuments();

  return {
    totalEvents,
    totalCertificates,
    totalAttendance,
    totalPoints,
  };
};