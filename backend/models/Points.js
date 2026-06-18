import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false, // 🔥 FIXED (was true)
      default: null,
      index: true,
    },

    points: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        "Participation",
        "Winner",
        "Runner-Up",
        "Volunteer",
        "Organizer",
        "Bonus",
      ],
      default: "Participation",
    },

    remarks: {
      type: String,
      default: "",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ❌ REMOVE THIS INDEX (it will break manual points)
pointsSchema.index(
  {
    user: 1,
    event: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("Points", pointsSchema);