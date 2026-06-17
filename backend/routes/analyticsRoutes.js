import express from "express";
import {
  getAnalytics,
  exportCSV,
  exportPDF,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Analytics Dashboard
router.get("/", protect, getAnalytics);

// Export CSV Report
router.get("/export/csv", protect, exportCSV);

// Export PDF Report
router.get("/export/pdf", protect, exportPDF);

export default router;