import Notification from "../models/Notification.js";
import NotificationPreference from "../models/NotificationPreference.js";

// ==========================
// Get all notifications
// ==========================
export const getNotifications = async (req, res) => {
  try {
    console.log("Logged user:", req.user);

    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Notifications found:", notifications.length);

    return res.status(200).json(notifications);
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// Mark notification as read
// ==========================
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (err) {
    console.error("MARK AS READ ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// Get unread count
// ==========================
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    return res.status(200).json({
      unreadCount: count,
    });
  } catch (err) {
    console.error("UNREAD COUNT ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// Get notification preferences
// ==========================
export const getPreferences = async (req, res) => {
  try {
    let preferences = await NotificationPreference.findOne({
      user: req.user.id,
    });

    if (!preferences) {
      preferences = await NotificationPreference.create({
        user: req.user.id,
      });
    }

    return res.status(200).json(preferences);
  } catch (err) {
    console.error("GET PREFERENCES ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// Update notification preferences
// ==========================
export const updatePreferences = async (req, res) => {
  try {
    const { inAppEnabled, emailEnabled } = req.body;

    let preferences = await NotificationPreference.findOne({
      user: req.user.id,
    });

    if (!preferences) {
      preferences = new NotificationPreference({
        user: req.user.id,
      });
    }

    if (inAppEnabled !== undefined) {
      preferences.inAppEnabled = inAppEnabled;
    }

    if (emailEnabled !== undefined) {
      preferences.emailEnabled = emailEnabled;
    }

    await preferences.save();

    return res.status(200).json(preferences);
  } catch (err) {
    console.error("UPDATE PREFERENCES ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};