import express from "express";
import {
  getNotifications,
  markAsRead,
  getUnreadCount,
  getPreferences,
  updatePreferences,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Notifications
// ==========================

// Get all notifications
router.get(
  "/",
  protect,
  getNotifications
);

// Get unread count
router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

// ==========================
// Notification Preferences
// ==========================
router.get(
  "/preferences",
  protect,
  getPreferences
);

router.put(
  "/preferences",
  protect,
  updatePreferences
);

// Mark notification as read
router.put(
  "/:id",
  protect,
  markAsRead
);

export default router;