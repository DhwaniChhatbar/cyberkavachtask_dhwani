import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";

const router = express.Router();

// ==========================
// GET ALL AUDIT LOGS
// ==========================
router.get("/", getAuditLogs);

export default router;