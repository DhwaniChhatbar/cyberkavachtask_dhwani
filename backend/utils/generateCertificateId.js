export const generateCertificateId = () => {
  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `CERT-${Date.now()}-${random}`;
};