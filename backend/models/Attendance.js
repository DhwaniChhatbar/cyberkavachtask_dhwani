import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // ==========================
    // EVENT
    // ==========================
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    // ==========================
    // TEAM / MEMBER
    // ==========================
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================
    // CHECK-IN / CHECK-OUT
    // ==========================
    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    // ==========================
    // STATUS
    // ==========================
    status: {
      type: String,
      enum: [
        "checked-in",
        "checked-out",
        "late",
        "early-exit",
        "completed",
      ],
      default: "checked-in",
    },

    lateFlag: {
      type: Boolean,
      default: false,
    },

    earlyExitFlag: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // MODULE 2 (CERTIFICATE)
    // ==========================
    certificateGenerated: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // MODULE 5 (POINTS SYSTEM)
    // ==========================
    pointsAwarded: {
      type: Boolean,
      default: false,
    },

    durationMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// INDEX (PREVENT DUPLICATES)
// ==========================
attendanceSchema.index(
  { event: 1, team: 1, member: 1 },
  { unique: true }
);

// ==========================
// VALIDATION RULE
// ==========================
attendanceSchema.pre("save", function (next) {
  if (!this.team && !this.member) {
    return next(new Error("Either team or member is required"));
  }
  next();
});

export default mongoose.model("Attendance", attendanceSchema);