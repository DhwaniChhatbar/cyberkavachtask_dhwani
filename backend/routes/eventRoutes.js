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
 * ROLE DEFINITIONS
 * ==========================
 */

// Tech Coordinator only
const techOnly = ["Tech Coordinator"];

// Faculty Coordinator only
const facultyOnly = ["Faculty Coordinator"];

// Student Coordinator only
const studentOnly = ["Student Coordinator"];

// Everyone who can view events
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
 * Faculty + Student only
 * ==========================
 */
router.get(
  "/pending",
  protect,
  authorizeRoles(
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  getPendingEvents
);

/**
 * ==========================
 * GET SINGLE EVENT
 * ==========================
 */
router.get(
  "/:id",
  protect,
  authorizeRoles(...allUsers),
  getEventById
);

/**
 * ==========================
 * CREATE EVENT
 * Tech Coordinator only
 * ==========================
 */
router.post(
  "/",
  protect,
  authorizeRoles(...techOnly),
  upload.single("poster"),
  createEvent
);

/**
 * ==========================
 * UPDATE EVENT
 * Tech Coordinator only
 * ==========================
 */
router.put(
  "/:id",
  protect,
  authorizeRoles(...techOnly),
  upload.single("poster"),
  updateEvent
);

/**
 * ==========================
 * DELETE EVENT
 * Faculty Coordinator only
 * ==========================
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles(...facultyOnly),
  deleteEvent
);

/**
 * ==========================
 * SEND FOR APPROVAL
 * Draft → Pending Faculty Review
 * Tech Coordinator only
 * ==========================
 */
router.put(
  "/approval/:id",
  protect,
  authorizeRoles(...techOnly),
  sendForApproval
);

/**
 * ==========================
 * APPROVE EVENT
 * Pending Faculty Review → Approved by Faculty
 * Faculty Coordinator only
 * ==========================
 */
router.put(
  "/approve/:id",
  protect,
  authorizeRoles(...facultyOnly),
  approveEvent
);

/**
 * ==========================
 * PUBLISH EVENT
 * Approved by Faculty → Published
 * Student Coordinator only
 * ==========================
 */
router.put(
  "/publish/:id",
  protect,
  authorizeRoles(...studentOnly),
  publishEvent
);

export default router;