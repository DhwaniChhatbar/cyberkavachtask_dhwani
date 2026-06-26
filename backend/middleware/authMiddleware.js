import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
try {
const authHeader = req.headers.authorization;

// 🔒 Check header format
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({
    message: "No token provided",
  });
}

const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({
    message: "Token missing",
  });
}

// 🔐 Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);

if (!decoded?.id) {
  return res.status(401).json({
    message: "Invalid token payload",
  });
}

// 🧠 Fetch fresh user from DB (IMPORTANT FOR MODULE 1–6 CONSISTENCY)
const user = await User.findById(decoded.id).select(
  "name email role isApproved"
);

if (!user) {
  return res.status(401).json({
    message: "User not found",
  });
}

// 🚫 Block unapproved users (important for your system)
if (!user.isApproved) {
  return res.status(403).json({
    message: "Account not approved yet",
  });
}

// ✅ Attach standardized user object
req.user = {
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isApproved: user.isApproved,
};

return next();

} catch (err) {
return res.status(401).json({
message: "Invalid or expired token",
});
}
};