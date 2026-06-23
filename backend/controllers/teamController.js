import Team from "../models/Team.js";
import Event from "../models/Event.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================
// CREATE TEAM
// ==========================
export const createTeam = async (req, res) => {
  try {
    const {
      teamName,
      event,
      members,
      previousEvent,
      leaderName,
      leaderEmail,
    } = req.body;

    if (!teamName || !event) {
      return res.status(400).json({
        success: false,
        message: "Team name and event are required",
      });
    }

    const eventDoc = await Event.findById(event);

    if (!eventDoc) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (eventDoc.status !== "Published") {
      return res.status(400).json({
        success: false,
        message: "Registrations are not open for this event",
      });
    }

    if (eventDoc.registrationCount >= eventDoc.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event capacity is full",
      });
    }

    const existingTeam = await Team.findOne({
      teamName,
      event,
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: "Team already exists for this event",
      });
    }

    const teamId = "TEAM-" + Date.now();

    const team = await Team.create({
      teamName,
      teamId,
      event,
      leader: req.user.id,
      leaderName,
      leaderEmail,
      members: members || [],
      previousEvent: previousEvent || "",
      status: "Approved",
    });

    eventDoc.registrationCount += 1;
    await eventDoc.save();

    const io = req.app.get("io");

    if (io) {
      io.emit("team-created", team);
    }

    if (leaderEmail) {
      try {
        const message = `
Hello ${leaderName}

Your team has been registered successfully.

TEAM DETAILS

Team Name : ${teamName}
Team ID : ${teamId}
Event : ${eventDoc.name}

Status : Registered

Thank you for participating!
`;

        await sendEmail(
          leaderEmail,
          "Team Registration Successful 🎉",
          message
        );
      } catch (emailErr) {
        console.log("Email error:", emailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Team registered successfully",
      team,
    });
  } catch (err) {
    console.log("CREATE TEAM ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// GET ALL TEAMS
// ==========================
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("event")
      .populate("leader", "name email")
      .sort({ createdAt: -1 });

    return res.json(teams);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// GET TEAM BY ID
// ==========================
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate("event")
      .populate("leader", "name email");

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    return res.json(team);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// UPDATE TEAM
// ==========================
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

    return res.json(team);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// DELETE TEAM
// ==========================
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    const eventDoc = await Event.findById(team.event);

    if (eventDoc && eventDoc.registrationCount > 0) {
      eventDoc.registrationCount -= 1;
      await eventDoc.save();
    }

    await team.deleteOne();

    return res.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};