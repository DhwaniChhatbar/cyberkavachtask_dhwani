import express from "express";
import {
  assignPoints,
  getPointsHistory,
} from "../controllers/pointsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * ==========================
 * ASSIGN POINTS
 * Faculty Coordinator + Student Coordinator
 * ==========================
 */
router.post(
  "/assign",
  protect,
  authorizeRoles(
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  assignPoints
);

/**
 * ==========================
 * POINTS HISTORY
 * ==========================
 */
router.get(
  "/history",
  protect,
  getPointsHistory
);

export default router;