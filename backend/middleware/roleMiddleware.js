export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1. Check authentication exists
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized: user not found",
        });
      }

      // 2. Safe role extraction (FIXED EDGE CASE)
      const userRole = (req.user.role || "").trim();

      if (!userRole) {
        return res.status(403).json({
          message: "Access denied: role missing",
        });
      }

      // 3. Check permission
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Access denied for role: ${userRole}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Authorization middleware error",
        error: error.message,
      });
    }
  };
};