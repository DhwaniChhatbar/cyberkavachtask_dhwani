import Notification from "../models/Notification.js";

// Get notifications of logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(
      req.params.id
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};