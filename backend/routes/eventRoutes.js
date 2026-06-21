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
 * ROLE DEFINITIONS (STRICT FLOW)
 * ==========================
 */

// Only Tech Coordinator can create & submit
const techOnly = ["Tech Coordinator"];

// Faculty only approves
const facultyOnly = ["Faculty Coordinator"];

// Student only publishes
const studentOnly = ["Student Coordinator"];

// For viewing/managing (safe read access)
const allCoordinators = [
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
];

/**
 * ==========================
 * GET ALL EVENTS
 * (AUTH REQUIRED — prevent data leak)
 * ==========================
 */
router.get("/", protect, authorizeRoles(...allCoordinators), getEvents);

/**
 * ==========================
 * GET PENDING EVENTS
 * Faculty + Student only (as per your UI)
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
 * CREATE EVENT (TECH ONLY)
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
 * UPDATE EVENT (TECH ONLY + SAFE)
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
 * DELETE EVENT (FACULTY ONLY - SAFE CONTROL)
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
 * SEND FOR APPROVAL (TECH ONLY)
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
 * PUBLISH EVENT (STUDENT ONLY)
 * ==========================
 */
router.put(
  "/publish/:id",
  protect,
  authorizeRoles(...studentOnly),
  publishEvent
);

export default router;