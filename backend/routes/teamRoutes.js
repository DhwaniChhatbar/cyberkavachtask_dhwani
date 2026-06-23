import express from "express";

import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * ==========================
 * CREATE TEAM
 * Members + Coordinators
 * ==========================
 */
router.post(
  "/",
  protect,
  authorizeRoles(
    "Member",
    "Tech Coordinator",
    "Faculty Coordinator",
    "Student Coordinator",
    "Content Coordinator",
    "Social Media Coordinator"
  ),
  createTeam
);

/**
 * ==========================
 * GET ALL TEAMS
 * Protected
 * ==========================
 */
router.get(
  "/",
  protect,
  authorizeRoles(
    "Member",
    "Tech Coordinator",
    "Faculty Coordinator",
    "Student Coordinator",
    "Content Coordinator",
    "Social Media Coordinator"
  ),
  getTeams
);

/**
 * ==========================
 * GET TEAM BY ID
 * Protected
 * ==========================
 */
router.get(
  "/:id",
  protect,
  authorizeRoles(
    "Member",
    "Tech Coordinator",
    "Faculty Coordinator",
    "Student Coordinator",
    "Content Coordinator",
    "Social Media Coordinator"
  ),
  getTeamById
);

/**
 * ==========================
 * UPDATE TEAM
 * Leader/Coordinators
 * ==========================
 */
router.put(
  "/:id",
  protect,
  authorizeRoles(
    "Member",
    "Tech Coordinator",
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  updateTeam
);

/**
 * ==========================
 * DELETE TEAM
 * Coordinators Only
 * ==========================
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "Tech Coordinator",
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  deleteTeam
);

export default router;