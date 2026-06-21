import express from "express";
import {
  searchUsers,
  getAllUsers,
  getUserCount,
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
const facultyOnly = ["Faculty Coordinator"];

/**
 * ==========================
 * SEARCH USERS
 * ==========================
 */
router.get(
  "/search",
  protect,
  searchUsers
);

/**
 * ==========================
 * FAST USER COUNT
 * ==========================
 * MUST be above "/:id"
 */
router.get(
  "/count",
  protect,
  getUserCount
);

/**
 * ==========================
 * GET ALL USERS
 * ==========================
 * Faculty Coordinator only
 */
router.get(
  "/",
  protect,
  authorizeRoles(...facultyOnly),
  getAllUsers
);

/**
 * ==========================
 * GET USER BY ID
 * ==========================
 */
router.get(
  "/:id",
  protect,
  getUserById
);

/**
 * ==========================
 * UPDATE USER ROLE
 * ==========================
 * Faculty Coordinator only
 */
router.put(
  "/:id/role",
  protect,
  authorizeRoles(...facultyOnly),
  updateUserRole
);

/**
 * ==========================
 * APPROVE USER
 * ==========================
 * Faculty Coordinator only
 */
router.put(
  "/:id/approve",
  protect,
  authorizeRoles(...facultyOnly),
  approveUser
);

/**
 * ==========================
 * DELETE USER
 * ==========================
 * Faculty Coordinator only
 */
router.delete(
  "/:id",
  protect,
  authorizeRoles(...facultyOnly),
  deleteUser
);

export default router;