import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
} from "../controllers/eventController.js";

import upload from "../utils/upload.js";

const router = express.Router();

// ✅ CREATE EVENT (with poster upload)
router.post("/", upload.single("poster"), createEvent);

// GET ALL EVENTS
router.get("/", getEvents);

// GET SINGLE EVENT
router.get("/:id", getEventById);

export default router;