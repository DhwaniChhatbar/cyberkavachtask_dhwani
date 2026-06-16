import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// GET SETTINGS
// ==========================
router.get("/", protect, getSettings);

// ==========================
// UPDATE SETTINGS
// ==========================
router.put("/", protect, updateSettings);

export default router;