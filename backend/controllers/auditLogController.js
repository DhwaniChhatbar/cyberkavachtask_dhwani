import AuditLog from "../models/AuditLog.js";

// GET ALL LOGS
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

// CREATE LOG (used internally)
export const createAuditLog = async (data) => {
  try {
    await AuditLog.create(data);
  } catch (err) {
    console.error("Audit log error:", err);
  }
};