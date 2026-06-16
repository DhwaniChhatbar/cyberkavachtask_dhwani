import express from "express";
import {
  generateCertificate,
  getCertificates,
  verifyCertificate,
} from "../controllers/certificateController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// 🔥 GENERATE CERTIFICATE
// ==========================
router.post(
  "/generate",
  protect,
  generateCertificate
);

// ==========================
// 🔥 GET ALL CERTIFICATES
// ==========================
router.get(
  "/",
  protect,
  getCertificates
);

// ==========================
// 🔥 VERIFY CERTIFICATE
// Public endpoint
// ==========================
router.get(
  "/verify/:certificateId",
  verifyCertificate
);

export default router;