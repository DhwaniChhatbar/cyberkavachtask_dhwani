import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Request",
        "Approval",
        "Rejection",
        "Event",
        "Certificate",
        "Attendance",
        "Points",
        "Badge",
      ],
      default: "Request",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for notification page
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Notification",
  notificationSchema
);