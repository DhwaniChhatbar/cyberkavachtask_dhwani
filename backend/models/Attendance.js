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
    // TEAM (optional)
    // ==========================
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
      index: true,
    },

    // ==========================
    // MEMBER (optional)
    // ==========================
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ==========================
    // PARTICIPANT SNAPSHOT
    // ==========================
    participantDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        default: "",
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
        default: "",
        trim: true,
      },

      institute: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // ==========================
    // ATTENDANCE TIMES
    // ==========================
    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================
    // STATUS
    // ==========================
    status: {
      type: String,
      enum: ["checked-in", "checked-out", "late", "early-exit", "completed"],
      default: "checked-in",
      index: true,
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
    // CERTIFICATE
    // ==========================
    certificateGenerated: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // POINTS
    // ==========================
    pointsAwarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//
// ==========================
// INDEXES
// ==========================
// Prevent duplicate attendance per event + participant
//
attendanceSchema.index(
  { event: 1, "participantDetails.collegeId": 1 },
  { unique: true }
);

attendanceSchema.index({ event: 1 });
attendanceSchema.index({ team: 1 });
attendanceSchema.index({ member: 1 });
attendanceSchema.index({ status: 1 });

//
// ==========================
// VALIDATION (FIXED - NO next())
// ==========================
// This replaces pre("save") / pre("validate") middleware
//
attendanceSchema.pre("validate", function () {
  if (!this.team && !this.member) {
    throw new Error("Either team or member is required.");
  }
});

export default mongoose.model("Attendance", attendanceSchema);