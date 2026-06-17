import express from "express";

import {
createTeam,
getTeams,
getTeamById,
updateTeam,
deleteTeam,
} from "../controllers/teamController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// CREATE TEAM
// ==========================
router.post("/", protect, createTeam);

// ==========================
// GET ALL TEAMS
// ==========================
router.get("/", getTeams);

// ==========================
// GET TEAM BY ID
// ==========================
router.get("/:id", getTeamById);

// ==========================
// UPDATE TEAM
// ==========================
router.put("/:id", protect, updateTeam);

// ==========================
// DELETE TEAM
// ==========================
router.delete("/:id", protect, deleteTeam);

export default router;
