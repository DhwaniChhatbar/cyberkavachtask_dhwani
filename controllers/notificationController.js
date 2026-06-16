import Notification from "../models/Notification.js";
import NotificationPreference from "../models/NotificationPreference.js";

// ==========================
// Get all notifications
// ==========================
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.json(preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    res.json(preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};