import express from "express";
import {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ==========================
 * DEBUG MIDDLEWARE (TEMP SAFE)
 * ==========================
 */
const debugRequest = (req, res, next) => {
  console.log("📩 REQUEST HIT:", req.method, req.originalUrl);
  console.log("BODY:", req.body);
  next();
};

// ==========================
// CREATE REQUEST
// ==========================
router.post("/", protect, debugRequest, createRequest);

// ==========================
// GET MY REQUESTS
// MUST BE ABOVE "/:id"
// ==========================
router.get("/my", protect, getMyRequests);

// ==========================
// GET ALL REQUESTS
// ==========================
router.get("/", protect, getAllRequests);

// ==========================
// GET SINGLE REQUEST
// ==========================
router.get("/:id", protect, getRequestById);

// ==========================
// APPROVE REQUEST
// ==========================
router.put("/approve/:id", protect, approveRequest);

// ==========================
// REJECT REQUEST
// ==========================
router.put("/reject/:id", protect, rejectRequest);

export default router;