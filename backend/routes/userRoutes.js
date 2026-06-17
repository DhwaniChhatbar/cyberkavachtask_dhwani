import express from "express";
import {
  searchUsers,
  getAllUsers,
  getUserById,
  updateUserRole,
  approveUser,
  deleteUser,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ==========================
 * USER ROUTES (PROTECTED)
 * ==========================
 * NOTE:
 * - All routes require JWT auth
 * - Specific routes MUST come before params
 */

// 🔍 SEARCH USERS
router.get("/search", protect, searchUsers);

// 👥 GET ALL USERS
router.get("/", protect, getAllUsers);

// 👤 GET USER BY ID
router.get("/:id", protect, getUserById);

// ✏️ UPDATE USER ROLE
router.put("/:id/role", protect, updateUserRole);

// ✅ APPROVE USER
router.put("/:id/approve", protect, approveUser);

// ❌ DELETE USER
router.delete("/:id", protect, deleteUser);

export default router;