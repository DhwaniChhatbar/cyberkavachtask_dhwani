import AuditLog from "../models/AuditLog.js";

// ==========================
// GET ALL AUDIT LOGS
// ==========================
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      logs,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
};

// ==========================
// CREATE AUDIT LOG
// ==========================
export const createAuditLog = async (
  user,
  module,
  action
) => {
  try {
    await AuditLog.create({
      user,
      module,
      action,
    });
  } catch (err) {
    console.error("Audit Log Error:", err);
  }
};