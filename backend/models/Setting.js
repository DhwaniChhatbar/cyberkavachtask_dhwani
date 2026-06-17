import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    // Academic Year
    academicYear: {
      type: String,
      default: "2025-26",
    },

    // Event Categories
    eventCategories: {
      type: [String],
      default: [
        "Workshop",
        "Seminar",
        "Hackathon",
        "Competition",
      ],
    },

    // Point Policies
    pointPolicy: {
      attendance: {
        type: Number,
        default: 5,
      },

      volunteer: {
        type: Number,
        default: 10,
      },

      winner: {
        type: Number,
        default: 20,
      },

      participation: {
        type: Number,
        default: 3,
      },
    },

    // Club Name
    clubName: {
      type: String,
      default: "CyberKavach",
    },

    // Current Semester
    semester: {
      type: String,
      default: "Odd",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Setting", settingSchema);