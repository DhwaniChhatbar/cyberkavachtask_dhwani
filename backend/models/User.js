import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
},

email: {
  type: String,
  required: true,
  unique: true,
},

password: {
  type: String,
  required: true,
},

role: {
  type: String,
  enum: [
    "Admin",
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
    "Content Coordinator",
    "Social Media Coordinator",
    "Member",
    "Guest",
  ],
  default: "Member",
},

isApproved: {
  type: Boolean,
  default: false,
},

// OTP SYSTEM
otp: {
  type: String,
  default: null,
},

otpExpiry: {
  type: Date,
  default: null,
},

// RESET PASSWORD TOKEN
resetPasswordToken: {
  type: String,
  default: null,
},
},
{
timestamps: true,
}
);

export default mongoose.model("User", userSchema);
