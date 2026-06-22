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

const eventDoc = await Event.findById(event);

if (!eventDoc) {
  return res.status(404).json({
    success: false,
    message: "Event not found",
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
  members,
  previousEvent,
  status: "Pending",
});

// Increase registration count
eventDoc.registrationCount += 1;
await eventDoc.save();

// Socket event
const io = req.app.get("io");

if (io) {
  io.emit("team-created", team);
}

// Email notification
if (leaderEmail) {
  const message =
    "Hello " +
    leaderName +
    "\n\nYour team has been registered successfully.\n\n" +
    "TEAM DETAILS\n\n" +
    "Team Name : " +
    teamName +
    "\n" +
    "Team ID : " +
    teamId +
    "\n" +
    "Event : " +
    eventDoc.name +
    "\n\nStatus : Pending Approval\n\n" +
    "Thank you for participating!";

  await sendEmail(
    leaderEmail,
    "Team Registration Successful 🎉",
    message
  );
}

res.status(201).json({
  success: true,
  message: "Team created successfully",
  team,
});

} catch (err) {
res.status(500).json({
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
.populate("members", "name email")
.sort({ createdAt: -1 });

res.json(teams);

} catch (err) {
res.status(500).json({
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
.populate("leader", "name email")
.populate("members", "name email");

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

res.json(team);

} catch (err) {
res.status(500).json({
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

await team.deleteOne();

res.json({
  success: true,
  message: "Team deleted successfully",
});

} catch (err) {
res.status(500).json({
error: err.message,
});
}
};
