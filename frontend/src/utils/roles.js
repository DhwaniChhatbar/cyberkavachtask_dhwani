export const canApproveRequests = (user) => {
  if (!user) return false;

  const role = user.role;

  return [
    "Admin",
    "Faculty Coordinator",
    "Student Coordinator",
    "Tech Coordinator",
  ].includes(role);
};