import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
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

    members: [
      {
        type: String,
        trim: true,
      },
    ],

    // Team history reuse
    previousEvent: {
      type: String,
      default: "",
    },

    // Event this team is currently registered for
    eventName: {
      type: String,
      default: "",
    },

    // Leader information
    leaderName: {
      type: String,
      default: "",
    },

    leaderEmail: {
      type: String,
      default: "",
    },

    // QR code data (can store Team ID or QR URL later)
    qrCode: {
      type: String,
      default: "",
    },

    // Team status
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Team",
  teamSchema
);