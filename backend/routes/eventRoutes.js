import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  sendForApproval,
  approveEvent,
  publishEvent,
  getPendingEvents,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import upload from "../utils/upload.js";

const router = express.Router();

/**
 * ==========================
 * ROLE GROUPS
 * ==========================
 */

const allUsers = [
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
  "Content Coordinator",
  "Social Media Coordinator",
  "Member",
];

/**
 * ==========================
 * GET ALL EVENTS
 * ==========================
 */
router.get(
  "/",
  protect,
  authorizeRoles(...allUsers),
  getEvents
);

/**
 * ==========================
 * GET PENDING EVENTS
 * (IMPORTANT: keep BEFORE /:id safety-wise)
 * ==========================
 */
router.get(
  "/pending",
  protect,
  authorizeRoles("Faculty Coordinator", "Student Coordinator"),
  getPendingEvents
);

/**
 * ==========================
 * CREATE EVENT
 * ==========================
 */
router.post(
  "/",
  protect,
  authorizeRoles("Tech Coordinator"),
  upload.single("poster"),
  createEvent
);

/**
 * ==========================
 * SEND FOR APPROVAL
 * ==========================
 */
router.put(
  "/approval/:id",
  protect,
  authorizeRoles("Tech Coordinator"),
  sendForApproval
);

/**
 * ==========================
 * APPROVE EVENT
 * ==========================
 */
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("Faculty Coordinator"),
  approveEvent
);

/**
 * ==========================
 * PUBLISH EVENT
 * ==========================
 */
router.put(
  "/publish/:id",
  protect,
  authorizeRoles("Student Coordinator"),
  publishEvent
);

/**
 * ==========================
 * UPDATE EVENT
 * ==========================
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("Tech Coordinator"),
  upload.single("poster"),
  updateEvent
);

/**
 * ==========================
 * DELETE EVENT
 * ==========================
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("Faculty Coordinator"),
  deleteEvent
);

/**
 * ==========================
 * GET SINGLE EVENT
 * (KEEP LAST to avoid route conflicts)
 * ==========================
 */
router.get(
  "/:id",
  protect,
  authorizeRoles(...allUsers),
  getEventById
);

export default router;