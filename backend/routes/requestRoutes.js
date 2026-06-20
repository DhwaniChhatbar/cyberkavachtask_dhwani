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
 * DEBUG MIDDLEWARE (OPTIONAL)
 * ==========================
 */
const debugRequest = (req, res, next) => {
  console.log("📩 REQUEST HIT:", req.method, req.originalUrl);
  console.log("BODY:", req.body);
  next();
};

/**
 * ==========================
 * APPROVER ROLES
 * ==========================
 *
 * Faculty Coordinator -> Final Approver
 * Student Coordinator -> Level 2 Approver
 * Tech Coordinator -> Technical approvals
 * Content Coordinator -> Content approvals
 * Social Media Coordinator -> Social approvals
 */
const approverRoles = [
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
  "Content Coordinator",
  "Social Media Coordinator",
];

/**
 * ==========================
 * CREATE REQUEST
 * Anyone except Guest can create requests
 * ==========================
 */
router.post(
  "/",
  protect,
  debugRequest,
  authorizeRoles(
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
    "Content Coordinator",
    "Social Media Coordinator",
    "Member"
  ),
  createRequest
);

/**
 * ==========================
 * GET MY REQUESTS
 * ==========================
 */
router.get(
  "/my",
  protect,
  getMyRequests
);

/**
 * ==========================
 * GET ALL REQUESTS
 * Approvers only
 * ==========================
 */
router.get(
  "/",
  protect,
  authorizeRoles(...approverRoles),
  getAllRequests
);

/**
 * ==========================
 * GET SINGLE REQUEST
 * ==========================
 */
router.get(
  "/:id",
  protect,
  getRequestById
);

/**
 * ==========================
 * APPROVE REQUEST
 * ==========================
 */
router.put(
  "/approve/:id",
  protect,
  authorizeRoles(...approverRoles),
  approveRequest
);

/**
 * ==========================
 * REJECT REQUEST
 * ==========================
 */
router.put(
  "/reject/:id",
  protect,
  authorizeRoles(...approverRoles),
  rejectRequest
);

export default router;