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

    // ==========================
    // TEAM
    // ==========================
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    // ==========================
    // MEMBER
    // ==========================
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================
    // PARTICIPANT SNAPSHOT
    // ==========================
    participantDetails: {
      _id: false,

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
    // ATTENDANCE
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

// ==========================
// INDEXES
// ==========================

// Prevent duplicate attendance per participant/team in an event
attendanceSchema.index(
  { event: 1, team: 1, member: 1 },
  { unique: true }
);

attendanceSchema.index({ event: 1 });
attendanceSchema.index({ team: 1 });
attendanceSchema.index({ member: 1 });
attendanceSchema.index({ status: 1 });

// ==========================
// VALIDATION
// ==========================
attendanceSchema.pre("save", function (next) {
  if (!this.team && !this.member) {
    return next(
      new Error("Either team or member is required.")
    );
  }

  next();
});

export default mongoose.model("Attendance", attendanceSchema);