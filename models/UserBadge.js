import mongoose from "mongoose";

const userBadgeSchema = new mongoose.Schema(
  {
    // User receiving the badge
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Badge awarded
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
      index: true,
    },

    // Event associated with the badge (optional)
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    // How the badge was earned
    category: {
      type: String,
      enum: [
        "Participation",
        "Attendance",
        "Winner",
        "Volunteer",
        "Organizer",
        "Milestone",
        "Special",
      ],
      default: "Participation",
    },

    // Optional remarks
    remarks: {
      type: String,
      default: "",
    },

    // Date badge was earned
    awardedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate badge assignments
userBadgeSchema.index(
  {
    user: 1,
    badge: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "UserBadge",
  userBadgeSchema
);