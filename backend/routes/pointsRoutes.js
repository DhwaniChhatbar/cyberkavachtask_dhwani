import express from "express";
import { assignPoints } from "../controllers/pointsController.js";

const router = express.Router();

router.post("/assign", assignPoints);

export default router;