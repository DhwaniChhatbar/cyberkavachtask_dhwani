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
 * GENERATE CERTIFICATE
 * Faculty + Student Coordinator
 * ==========================
 */
router.post(
  "/",
  protect,
  authorizeRoles(
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  generateCertificate
);

/**
 * ==========================
 * GET ALL CERTIFICATES
 * Faculty + Student Coordinator
 * ==========================
 */
router.get(
  "/",
  protect,
  authorizeRoles(
    "Faculty Coordinator",
    "Student Coordinator"
  ),
  getCertificates
);

/**
 * ==========================
 * VERIFY CERTIFICATE
 * PUBLIC (SAFE ACCESS ONLY)
 * ==========================
 */
router.get("/verify/:certificateId", verifyCertificate);

export default router;