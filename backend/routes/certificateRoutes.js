import express from "express";
import {
  generateCertificate,
  getCertificates,
  verifyCertificate,
} from "../controllers/certificateController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

/**
 * ==========================
 * ROLE CONTROL (ONLY ADDITION)
 * ==========================
 * Only coordinators/admin should generate certificates
 */
const canGenerateRoles = [
  "Admin",
  "Faculty Coordinator",
  "Student Coordinator",
  "Tech Coordinator",
];

/**
 * ==========================
 * GENERATE CERTIFICATE
 * ==========================
 */
router.post(
  "/generate",
  protect,
  authorizeRoles(...canGenerateRoles),
  generateCertificate
);

/**
 * ==========================
 * GET ALL CERTIFICATES
 * ==========================
 */
router.get(
  "/",
  protect,
  getCertificates
);

/**
 * ==========================
 * VERIFY CERTIFICATE (PUBLIC)
 * ==========================
 */
router.get("/verify/:certificateId", verifyCertificate);

export default router;