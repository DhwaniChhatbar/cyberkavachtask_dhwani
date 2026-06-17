import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// GET LEADERBOARD
// Returns rank + user info + points + contributions + badge
// ==========================
router.get("/", protect, getLeaderboard);

export default router;