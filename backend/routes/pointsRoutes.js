import express from "express";
import { assignPoints } from "../controllers/pointsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 FIX: protect added here
router.post("/assign", protect, assignPoints);

export default router;