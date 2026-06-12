import express from "express";
import {
  searchUsers,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

/*
  IMPORTANT:
  Order matters → specific routes first
*/

// 🔍 SEARCH USERS (TEAM MEMBER SEARCH)
router.get("/search", searchUsers);

// 👥 GET ALL USERS
router.get("/", getAllUsers);

// 👤 GET USER BY ID
router.get("/:id", getUserById);

export default router;