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

// ==========================
// CREATE REQUEST
// ==========================
router.post("/", protect, (req, res, next) => {
  console.log("POST /api/requests HIT");
  next();
}, createRequest);

// ==========================
// GET ALL REQUESTS
// ==========================
router.get("/", protect, getAllRequests);

// ==========================
// GET MY REQUESTS
// MUST BE ABOVE "/:id"
// ==========================
router.get("/my", protect, getMyRequests);

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