import Setting from "../models/Setting.js";

// ==========================
// GET SETTINGS
// ==========================
export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Setting.create({
        academicYear: "2025-26",
        eventCategories: [
          "Workshop",
          "Seminar",
          "Hackathon",
          "Competition",
        ],
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// UPDATE SETTINGS
// ==========================
export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    settings.academicYear =
      req.body.academicYear || settings.academicYear;

    settings.eventCategories =
      req.body.eventCategories || settings.eventCategories;

    settings.clubName =
      req.body.clubName || settings.clubName;

    settings.semester =
      req.body.semester || settings.semester;

    // Point Policy
    if (req.body.pointPolicy) {
      settings.pointPolicy.attendance =
        req.body.pointPolicy.attendance ??
        settings.pointPolicy.attendance;

      settings.pointPolicy.volunteer =
        req.body.pointPolicy.volunteer ??
        settings.pointPolicy.volunteer;

      settings.pointPolicy.winner =
        req.body.pointPolicy.winner ??
        settings.pointPolicy.winner;

      settings.pointPolicy.participation =
        req.body.pointPolicy.participation ??
        settings.pointPolicy.participation;
    }

    await settings.save();

    res.json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};