import Event from "../models/Event.js";

// ==========================
// CREATE EVENT
// ==========================
export const createEvent = async (req, res) => {
  try {
    const existingEvent = await Event.findOne({
      name: req.body.name,
      date: req.body.date,
    });

    if (existingEvent) {
      return res.status(400).json({
        message: "Event already exists",
      });
    }

    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id,
      poster: req.file ? req.file.filename : "",
      status: "Draft",
      registrationCount: 0,
      certificatesEnabled: false,
      registrationLink: `http://localhost:5173/register-event/${Date.now()}`,
    });

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// GET ALL EVENTS
// ==========================
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    return res.json(events);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// GET EVENT BY ID
// ==========================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name");

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.json(event);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// UPDATE EVENT
// ==========================
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    Object.assign(event, req.body);

    if (req.file) {
      event.poster = req.file.filename;
    }

    await event.save();

    return res.json(event);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// DELETE EVENT
// ==========================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await event.deleteOne();

    return res.json({
      message: "Event deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// SEND FOR APPROVAL
// Tech Coordinator → Faculty Coordinator
// ==========================
export const sendForApproval = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.status === "Published") {
      return res.status(400).json({
        message: "Event already published",
      });
    }

    event.status = "Pending Approval";

    await event.save();

    return res.json({
      success: true,
      message: "Event sent for approval",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// APPROVE EVENT
// Faculty Coordinator
// ==========================
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.status !== "Pending Approval") {
      return res.status(400).json({
        message: "Event must be pending approval",
      });
    }

    event.approvedBy = req.user.id;
    await event.save();

    return res.json({
      success: true,
      message: "Event approved successfully",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// PUBLISH EVENT
// Student Coordinator
// ==========================
export const publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (req.user.role !== "Student Coordinator") {
      return res.status(403).json({
        message: "Only Student Coordinator can publish events",
      });
    }

    if (event.status !== "Pending Approval") {
      return res.status(400).json({
        message: "Event must be approved before publishing",
      });
    }

    event.status = "Published";
    event.approvalDate = new Date();
    event.certificatesEnabled = true;

    await event.save();

    return res.json({
      success: true,
      message: "Event published successfully",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// COMPLETE EVENT
// ==========================
export const completeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.isCompleted = true;

    await event.save();

    return res.json({
      success: true,
      message: "Event marked as completed",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};