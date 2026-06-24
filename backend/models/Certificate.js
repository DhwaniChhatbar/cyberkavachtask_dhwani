import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["Participation", "Winner", "Runner Up", "Special"],
      default: "Participation",
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    hash: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 FIX 1: safer partial index (Mongo stable behavior)
certificateSchema.index(
  { eventName: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      user: { $type: "objectId" },
    },
  }
);

// 🔥 FIX 2: safer team index
certificateSchema.index(
  { eventName: 1, team: 1 },
  {
    unique: true,
    partialFilterExpression: {
      team: { $type: "objectId" },
    },
  }
);

export default mongoose.model("Certificate", certificateSchema);