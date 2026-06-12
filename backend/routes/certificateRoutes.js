import express from "express";
import {
  generateCertificate,
  getCertificates,
  verifyCertificate,
} from "../controllers/certificateController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateCertificate);

router.get("/", protect, getCertificates);

router.get(
  "/verify/:certificateId",
  verifyCertificate
);

export default router;