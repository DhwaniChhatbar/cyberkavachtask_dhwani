import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    collegeId: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    institute: {
      type: String,
      required: true,
      trim: true,
    },

    isLeader: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const leaderSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    collegeId: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    institute: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

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
      required: true,
      unique: true,
      trim: true,
    },

    // ==========================
    // EVENT
    // ==========================
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // ==========================
    // LEADER USER REFERENCE
    // ==========================
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================
    // LEADER DETAILS
    // ==========================
    leaderDetails: {
      type: leaderSchema,
      required: true,
    },

    // ==========================
    // TEAM MEMBERS
    // ==========================
    members: {
      type: [memberSchema],
      default: [],
    },

    // ==========================
    // OPTIONAL HISTORY
    // ==========================
    previousEvent: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // QR SUPPORT
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
      default: "Approved",
    },

    // ==========================
    // ANALYTICS
    // ==========================
    points: {
      type: Number,
      default: 0,
      min: 0,
    },

    badgesEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// INDEXES
// ==========================
teamSchema.index({ event: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ teamId: 1 });

export default mongoose.model("Team", teamSchema);