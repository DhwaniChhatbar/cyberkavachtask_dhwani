import express from "express";

import {
  getMyBadges,
  getUserBadges,
  getAllUserBadges,
} from "../controllers/userBadgeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// GET ALL USER BADGES
// ==========================
router.get(
  "/",
  protect,
  getAllUserBadges
);

// ==========================
// GET MY BADGES
// ==========================
router.get(
  "/me",
  protect,
  getMyBadges
);

// ==========================
// GET BADGES OF A USER
// ==========================
router.get(
  "/:userId",
  protect,
  getUserBadges
);

export default router;