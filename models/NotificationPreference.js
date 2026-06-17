import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // In-app notifications
    inAppEnabled: {
      type: Boolean,
      default: true,
    },

    // Email notifications
    emailEnabled: {
      type: Boolean,
      default: true,
    },

    // Event reminders
    reminderEnabled: {
      type: Boolean,
      default: true,
    },

    // Request updates
    requestUpdatesEnabled: {
      type: Boolean,
      default: true,
    },

    // Attendance notifications
    attendanceEnabled: {
      type: Boolean,
      default: true,
    },

    // Points notifications
    pointsEnabled: {
      type: Boolean,
      default: true,
    },

    // Badge notifications
    badgeEnabled: {
      type: Boolean,
      default: true,
    },

    // Certificate notifications
    certificateEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema
);