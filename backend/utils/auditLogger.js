import AuditLog from "../models/AuditLog.js";

export const logAudit = async ({
  user = null,
  action,
  module = "",
  details = "",
  metadata = {},
}) => {
  try {
    if (!action) return; // 🔴 prevent empty logs

    await AuditLog.create({
      user,
      action,
      module,
      details,
      metadata,
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};