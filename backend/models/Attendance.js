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
    },

    eventName: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // TEAM
    // ==========================
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    teamName: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // USER
    // ==========================
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    participantType: {
      type: String,
      enum: ["Individual", "Team"],
      default: "Individual",
    },

    // ==========================
    // SNAPSHOT DETAILS
    // ==========================
    participantDetails: {
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

    // ==========================
    // CHECK-IN
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
    // CERTIFICATE MODULE
    // ==========================
    certificateGenerated: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // POINTS MODULE
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
// INDEXES
// ==========================
attendanceSchema.index(
  { event: 1, team: 1, member: 1 },
  { unique: true }
);

attendanceSchema.index({ event: 1 });
attendanceSchema.index({ team: 1 });
attendanceSchema.index({ member: 1 });

// ==========================
// VALIDATION
// ==========================
attendanceSchema.pre("save", function (next) {
  if (!this.team && !this.member) {
    return next(
      new Error("Either team or member is required")
    );
  }

  next();
});

export default mongoose.model(
  "Attendance",
  attendanceSchema
);