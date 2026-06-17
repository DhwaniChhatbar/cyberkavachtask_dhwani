import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getAnalytics,
  exportCSV,
  exportPDF,
} from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * ==========================
 * ADMIN - MODULE 6 ROUTES
 * ==========================
 */

// ==========================
// ANALYTICS DASHBOARD
// ==========================
router.get("/analytics", protect, getAnalytics);

// ==========================
// EXPORT REPORTS
// ==========================
router.get("/export/csv", protect, exportCSV);
router.get("/export/pdf", protect, exportPDF);

export default router;