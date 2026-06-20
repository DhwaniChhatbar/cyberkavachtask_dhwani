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
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * ==========================
 * ROLE GROUPS
 * ==========================
 */
const adminOnly = ["Admin", "Faculty Coordinator"];

/**
 * ==========================
 * SEARCH USERS
 * ==========================
 */
router.get("/search", protect, searchUsers);

/**
 * ==========================
 * GET ALL USERS
 * ==========================
 * Only Admin / Faculty can see all users
 */
router.get(
  "/",
  protect,
  authorizeRoles(...adminOnly),
  getAllUsers
);

/**
 * ==========================
 * GET USER BY ID
 * ==========================
 */
router.get("/:id", protect, getUserById);

/**
 * ==========================
 * UPDATE USER ROLE
 * ==========================
 * ONLY ADMIN CAN CHANGE ROLES
 */
router.put(
  "/:id/role",
  protect,
  authorizeRoles("Admin"),
  updateUserRole
);

/**
 * ==========================
 * APPROVE USER
 * ==========================
 * Admin + Faculty only
 */
router.put(
  "/:id/approve",
  protect,
  authorizeRoles(...adminOnly),
  approveUser
);

/**
 * ==========================
 * DELETE USER
 * ==========================
 * ONLY ADMIN
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  deleteUser
);

export default router;