import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    // ==========================
    // BASIC INFO
    // ==========================
    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    teamId: {
      type: String,
      unique: true,
      required: true,
    },

    // ==========================
    // EVENT LINK
    // ==========================
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // ==========================
    // TEAM LEADER
    // ==========================
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    leaderName: {
      type: String,
      default: "",
    },

    leaderEmail: {
      type: String,
      default: "",
    },

    // ==========================
    // MEMBERS
    // ==========================
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ==========================
    // OPTIONAL HISTORY
    // ==========================
    previousEvent: {
      type: String,
      default: "",
    },

    // ==========================
    // QR / CHECK-IN SUPPORT
    // ==========================
    qrCode: {
      type: String,
      default: "",
    },

    // ==========================
    // STATUS
    // ==========================
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    // ==========================
    // ANALYTICS
    // ==========================
    points: {
      type: Number,
      default: 0,
    },

    badgesEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// INDEXES (FIXED - NO DUPLICATE INDEX)
// ==========================
teamSchema.index({ event: 1 });
teamSchema.index({ leader: 1 });

export default mongoose.model("Team", teamSchema);