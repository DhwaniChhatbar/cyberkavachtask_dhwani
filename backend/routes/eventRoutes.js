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
const techOnly = ["Tech Coordinator"];

const facultyOnly = ["Faculty Coordinator"];

const studentOnly = ["Student Coordinator"];

const allCoordinators = [
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
];

/**
 * ==========================
 * GET ALL EVENTS
 * ==========================
 */
router.get(
  "/",
  protect,
  authorizeRoles(...allCoordinators),
  getEvents
);

/**
 * ==========================
 * GET PENDING EVENTS
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
  authorizeRoles(...allCoordinators),
  getEventById
);

/**
 * ==========================
 * CREATE EVENT
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
 * ==========================
 */
router.put(
  "/publish/:id",
  protect,
  authorizeRoles(...studentOnly),
  publishEvent
);

export default router;