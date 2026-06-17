import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    // Badge name
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Description shown in UI
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Emoji or image URL
    icon: {
      type: String,
      default: "🏅",
    },

    // Minimum total points required
    minPoints: {
      type: Number,
      required: true,
      min: 0,
    },

    // Badge category
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

    // Badge rarity
    rarity: {
      type: String,
      enum: [
        "Common",
        "Rare",
        "Epic",
        "Legendary",
      ],
      default: "Common",
    },

    // Display order in UI
    level: {
      type: Number,
      default: 1,
    },

    // Enable/disable badge
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful for badge engine
badgeSchema.index({ minPoints: 1 });

// Useful for filtering
badgeSchema.index({ category: 1 });

export default mongoose.model(
  "Badge",
  badgeSchema
);