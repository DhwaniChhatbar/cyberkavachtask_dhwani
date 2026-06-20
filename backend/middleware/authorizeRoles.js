export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // User not authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Please login first.",
        });
      }

      // Role missing
      if (!req.user.role) {
        return res.status(401).json({
          success: false,
          message: "User role not found.",
        });
      }

      // Access denied
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied for this role.",
          currentRole: req.user.role,
        });
      }

      // Authorized
      next();
    } catch (err) {
      console.error("AUTHORIZE ROLES ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Authorization error",
      });
    }
  };
};
