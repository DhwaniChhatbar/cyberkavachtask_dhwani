import Event from "../models/Event.js";

// CREATE EVENT
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

      // 🔥 ADD THIS (POSTER FROM MULTER)
      poster: req.file ? req.file.filename : "",

      status: "Draft",
      registrationLink: `http://localhost:5173/register-event/${Date.now()}`,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL EVENTS
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET EVENT BY ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEND FOR APPROVAL
export const sendForApproval = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "Published") {
      return res.status(400).json({
        message: "Event already published",
      });
    }

    event.status = "Pending Approval";

    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLISH EVENT
export const publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 ROLE CHECK
    if (req.user?.role !== "Student Coordinator") {
      return res.status(403).json({
        message: "Only Student Coordinator can publish events",
      });
    }

    event.status = "Published";
    event.approvedBy = req.user?.name || "Student Coordinator";
    event.approvalDate = new Date();

    await event.save();

    res.json({
      message: "Event published successfully",
      event,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};