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
 * CREATE TEAM (REGISTRATION)
 * ONLY LOGGED-IN USERS (ANY ROLE)
 * ==========================
 */
router.post(
  "/",
  protect,
  createTeam
);

/**
 * ==========================
 * GET ALL TEAMS
 * COORDINATORS + MEMBERS
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
 * ONLY COORDINATORS + TECH CONTROL
 * ==========================
 */
router.put(
  "/:id",
  protect,
  authorizeRoles(
    "Tech Coordinator",
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  updateTeam
);

/**
 * ==========================
 * DELETE TEAM
 * ONLY ADMIN COORDINATORS
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