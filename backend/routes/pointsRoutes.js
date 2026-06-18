import express from "express";
import {
  assignPoints,
  getPointsHistory,
} from "../controllers/pointsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assign", protect, assignPoints);

router.get("/history", protect, getPointsHistory);

export default router;