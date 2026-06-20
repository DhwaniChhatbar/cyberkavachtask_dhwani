import express from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  sendForApproval,
  publishEvent,
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
  "Admin",
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
];

const canPublishEvents = [
  "Admin",
  "Faculty Coordinator",
  "Student Coordinator",
];

/**
 * ==========================
 * GET ALL EVENTS (PUBLIC OK)
 * ==========================
 */
router.get("/", getEvents);

/**
 * ==========================
 * GET SINGLE EVENT (PUBLIC OK)
 * ==========================
 */
router.get("/:id", getEventById);

/**
 * ==========================
 * CREATE EVENT
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
 * ==========================
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin", "Faculty Coordinator"),
  deleteEvent
);

/**
 * ==========================
 * SEND FOR APPROVAL
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
 * ==========================
 */
router.put(
  "/publish/:id",
  protect,
  authorizeRoles(...canPublishEvents),
  publishEvent
);

export default router;