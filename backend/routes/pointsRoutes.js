import express from "express";
import {
  assignPoints,
  getPointsHistory,
} from "../controllers/pointsController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * ONLY ADDITION: role protection
 * (NO other changes made)
 */
router.post(
  "/assign",
  protect,
  authorizeRoles("Admin", "Faculty Coordinator", "Student Coordinator"),
  assignPoints
);

router.get("/history", protect, getPointsHistory);

export default router;