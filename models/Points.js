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
      required: true,
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

// Prevent duplicate points for same user in same event
pointsSchema.index(
  {
    user: 1,
    event: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Points",
  pointsSchema
);