import mongoose from "mongoose";

// ==========================
// MEMBER SCHEMA
// ==========================
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
      lowercase: true,
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
  {
    _id: false,
  }
);

// ==========================
// LEADER SCHEMA
// ==========================
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
      lowercase: true,
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
  {
    _id: false,
  }
);

// ==========================
// TEAM SCHEMA
// ==========================
const teamSchema = new mongoose.Schema(
  {
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

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    leaderDetails: {
      type: leaderSchema,
      required: true,
    },

    members: {
      type: [memberSchema],
      default: [],
    },

    previousEvent: {
      type: String,
      default: "",
      trim: true,
    },

    qrCode: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },

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
    versionKey: false,
  }
);

// ==========================
// INDEXES
// ==========================
teamSchema.index({ event: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ event: 1, "members.collegeId": 1 });
// Used frequently in attendance lookups
teamSchema.index({ "members.collegeId": 1 });
teamSchema.index({ "members.email": 1 });

export default mongoose.model("Team", teamSchema);