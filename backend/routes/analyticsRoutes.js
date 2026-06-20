import express from "express";
import {
  getAnalytics,
  exportCSV,
  exportPDF,
} from "../controllers/analyticsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * ==========================
 * ROLE CONTROL (SAFE PATCH ONLY)
 * ==========================
 * Analytics should be restricted to leadership roles
 */
const canViewAnalytics = [
  "Admin",
  "Faculty Coordinator",
];

const canExportAnalytics = [
  "Admin",
  "Faculty Coordinator",
];

/**
 * ==========================
 * ANALYTICS DASHBOARD
 * ==========================
 */
router.get(
  "/",
  protect,
  authorizeRoles(...canViewAnalytics),
  getAnalytics
);

/**
 * ==========================
 * EXPORT CSV
 * ==========================
 */
router.get(
  "/export/csv",
  protect,
  authorizeRoles(...canExportAnalytics),
  exportCSV
);

/**
 * ==========================
 * EXPORT PDF
 * ==========================
 */
router.get(
  "/export/pdf",
  protect,
  authorizeRoles(...canExportAnalytics),
  exportPDF
);

export default router;