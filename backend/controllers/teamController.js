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
      leaderDetails,
      members = [],
      previousEvent,
    } = req.body;

    // ==========================
    // BASIC VALIDATION
    // ==========================
    if (!teamName || !event) {
      return res.status(400).json({
        success: false,
        message: "Team name and event are required",
      });
    }

    if (
      !leaderDetails ||
      !leaderDetails.fullName ||
      !leaderDetails.email ||
      !leaderDetails.collegeId ||
      !leaderDetails.department ||
      !leaderDetails.institute
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete leader details are required",
      });
    }

    // ==========================
    // FIND EVENT
    // ==========================
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

    // ==========================
    // FIX: SAFE TEAM SIZE HANDLING (PERMANENT)
    // ==========================
    const maxMembersAllowed = parseInt(eventDoc.teamSize, 10);

    if (isNaN(maxMembersAllowed) || maxMembersAllowed <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid team size configured for event",
      });
    }

    const safeMembers = Array.isArray(members) ? members : [];

    const validMembers = safeMembers.filter(
      (m) =>
        m.fullName &&
        m.email &&
        m.collegeId &&
        m.department &&
        m.institute
    );

    const totalRequested = 1 + validMembers.length;

    if (totalRequested > maxMembersAllowed) {
      return res.status(400).json({
        success: false,
        message: `Maximum team size allowed is ${maxMembersAllowed}. You tried ${totalRequested}.`,
      });
    }

    if (eventDoc.registrationCount >= eventDoc.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event capacity is full",
      });
    }

    // ==========================
    // CHECK DUPLICATE TEAM
    // ==========================
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

    // ==========================
    // TEAM ID
    // ==========================
    const teamId = "TEAM-" + Date.now();

    // ==========================
    // LEADER OBJECT
    // ==========================
    const leader = {
      user: req.user.id,
      fullName: leaderDetails.fullName,
      email: leaderDetails.email,
      collegeId: leaderDetails.collegeId,
      department: leaderDetails.department,
      institute: leaderDetails.institute,
      isLeader: true,
    };

    // ==========================
    // FINAL TEAM MEMBERS
    // ==========================
    const finalMembers = [
      leader,
      ...validMembers.map((m) => ({
        user: m.user || null,
        fullName: m.fullName,
        email: m.email,
        collegeId: m.collegeId,
        department: m.department,
        institute: m.institute,
        isLeader: false,
      })),
    ];

    // ==========================
    // CREATE TEAM
    // ==========================
    const team = await Team.create({
      teamName,
      teamId,
      event,
      leader: req.user.id,
      leaderDetails: leader,
      members: finalMembers,
      previousEvent: previousEvent || "",
      status: "Approved",
    });

    // ==========================
    // UPDATE EVENT COUNT
    // ==========================
    eventDoc.registrationCount += 1;
    await eventDoc.save();

    // ==========================
    // SOCKET EVENT
    // ==========================
    const io = req.app.get("io");
    if (io) io.emit("team-created", team);

    // ==========================
    // EMAIL
    // ==========================
    try {
      await sendEmail(
        leader.email,
        "Team Registration Successful 🎉",
        `Hello ${leader.fullName}

Team Name: ${teamName}
Team ID: ${teamId}
Event: ${eventDoc.name}

Team Size Limit: ${maxMembersAllowed}
Members Added: ${finalMembers.length}

Status: Registered`
      );
    } catch (err) {
      console.log("Email error:", err.message);
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
      .populate("event", "name")
      .populate("leader", "name email")
      .sort({ createdAt: -1 });

    const formattedTeams = teams.map((team) => ({
      _id: team._id,
      teamName: team.teamName,
      teamId: team.teamId,
      status: team.status,
      createdAt: team.createdAt,

      event: team.event,

      leaderDetails: team.leaderDetails,

      members: team.members,

      participantCount: team.members?.length || 0,
    }));

    return res.status(200).json({
      success: true,
      teams: formattedTeams,
      totalTeams: formattedTeams.length,
    });
  } catch (err) {
    console.log("GET TEAMS ERROR:", err);

    return res.status(500).json({
      success: false,
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
      .populate("event", "name")
      .populate("leader", "name email");

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    return res.status(200).json({
      success: true,
      team,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// UPDATE TEAM
// ==========================
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.json(team);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// DELETE TEAM
// ==========================
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
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
    return res.status(500).json({ error: err.message });
  }
};