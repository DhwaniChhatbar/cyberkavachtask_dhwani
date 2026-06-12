import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

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

    checkInTime: {
      type: Date,
      default: Date.now,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["checked-in", "checked-out", "late", "early-exit"],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Attendance", attendanceSchema);