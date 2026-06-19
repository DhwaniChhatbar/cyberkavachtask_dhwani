export const canApproveRequests = (user) => {
  if (!user || !user.role) return false;

  const role = String(user.role).trim();

  const APPROVER_ROLES = [
    "Admin",
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
  ];

  return APPROVER_ROLES.includes(role);
};