import Team from "../models/Team.js";
import sendEmail from "../utils/sendEmail.js";

// CREATE TEAM
export const createTeam = async (req, res) => {
  try {
    const {
      teamName,
      members,
      previousEvent,
      eventName,
      leaderName,
      leaderEmail,
    } = req.body;

    // Safer duplicate check (event + team)
    const existingTeam = await Team.findOne({
      teamName,
      eventName,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Team already exists for this event",
      });
    }

    const teamId = `TEAM-${Date.now()}`;

    // Create Team
    const team = await Team.create({
      teamName,
      members,
      previousEvent,
      eventName,
      leaderName,
      leaderEmail,
      teamId,
      status: "Pending",
    });

    // ==========================
    // 🔥 SOCKET REAL-TIME EMIT
    // ==========================
    const io = req.app.get("io");
    if (io) {
      io.emit("team-created", team);
    }

    // ==========================
    // 📧 EMAIL NOTIFICATION
    // ==========================
    if (leaderEmail) {
      await sendEmail(
        leaderEmail,
        "Team Registration Successful 🎉",
        `
Hello ${leaderName},

Your team has been successfully registered.

━━━━━━━━━━━━━━━━━━
TEAM DETAILS
━━━━━━━━━━━━━━━━━━
Team Name : ${teamName}
Team ID   : ${teamId}
Event     : ${eventName}

Members:
${members?.join(", ")}

Status: Pending Approval

━━━━━━━━━━━━━━━━━━
You will be notified once your team is approved.
Thank you for participating!
        `
      );
    }

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET ALL TEAMS
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({
      createdAt: -1,
    });

    res.json(teams);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET SINGLE TEAM
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// UPDATE TEAM
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE TEAM
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    await team.deleteOne();

    res.json({
      message: "Team deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};