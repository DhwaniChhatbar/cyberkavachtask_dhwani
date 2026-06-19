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
import { authorizeRoles } from "../middleware/authorizeRoles.js";

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
// ROLES THAT CAN APPROVE/REJECT
// ==========================
const approverRoles = [
  "Tech Coordinator",
  "Student Coordinator",
  "Faculty Coordinator",
];

// ==========================
// CREATE REQUEST
// ==========================
router.post("/", protect, debugRequest, createRequest);

// ==========================
// GET MY REQUESTS
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
// APPROVE REQUEST (ROLE PROTECTED)
// ==========================
router.put(
  "/approve/:id",
  protect,
  authorizeRoles(...approverRoles),
  approveRequest
);

// ==========================
// REJECT REQUEST (ROLE PROTECTED)
// ==========================
router.put(
  "/reject/:id",
  protect,
  authorizeRoles(...approverRoles),
  rejectRequest
);

export default router;