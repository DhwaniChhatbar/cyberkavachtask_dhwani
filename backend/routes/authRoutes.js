import express from "express";
import {
  register,
  login,
  sendOTP,
  verifyOTP,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();
//test//
router.get("/test-router", (req, res) => {
  res.json({ message: "ROUTER WORKS" });
});
// ==========================
// 🔥 AUTH ROUTES
// ==========================
router.post("/auth/register", register);
router.post("/auth/login", login);


// ==========================
// 🔥 OTP ROUTES
// ==========================
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


export default router;