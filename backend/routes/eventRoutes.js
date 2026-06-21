import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  sendForApproval,
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
const canManageEvents = [
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
];

const canPublishEvents = [
  "Faculty Coordinator",
  "Student Coordinator",
];

/**
 * ==========================
 * GET ALL EVENTS
 * ==========================
 */
router.get("/", getEvents);

/**
 * ==========================
 * GET PENDING EVENTS
 * Faculty Coordinator
 * Student Coordinator
 * ==========================
 */
router.get(
  "/pending",
  protect,
  authorizeRoles(...canPublishEvents),
  getPendingEvents
);

/**
 * ==========================
 * GET SINGLE EVENT
 * ==========================
 */
router.get("/:id", getEventById);

/**
 * ==========================
 * CREATE EVENT
 * Faculty Coordinator
 * Student Coordinator
 * Tech Coordinator
 * ==========================
 */
router.post(
  "/",
  protect,
  authorizeRoles(...canManageEvents),
  upload.single("poster"),
  createEvent
);

/**
 * ==========================
 * UPDATE EVENT
 * Faculty Coordinator
 * Student Coordinator
 * Tech Coordinator
 * ==========================
 */
router.put(
  "/:id",
  protect,
  authorizeRoles(...canManageEvents),
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
  authorizeRoles("Faculty Coordinator"),
  deleteEvent
);

/**
 * ==========================
 * SEND FOR APPROVAL
 * Faculty Coordinator
 * Student Coordinator
 * Tech Coordinator
 * ==========================
 */
router.put(
  "/approval/:id",
  protect,
  authorizeRoles(...canManageEvents),
  sendForApproval
);

/**
 * ==========================
 * PUBLISH EVENT
 * Faculty Coordinator
 * Student Coordinator
 * ==========================
 */
router.put(
  "/publish/:id",
  protect,
  authorizeRoles(...canPublishEvents),
  publishEvent
);

export default router;