import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";

const router = express.Router();

// GET /api/audit-logs
router.get("/", getAuditLogs);

export default router;