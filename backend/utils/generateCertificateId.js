import Certificate from "../models/Certificate.js";

export const generateCertificateId = async () => {
  let certificateId;
  let exists = true;

  while (exists) {
    const random = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    certificateId = `CERT-${new Date().getFullYear()}-${random}`;

    const existingCertificate = await Certificate.findOne({
      certificateId,
    });

    exists = !!existingCertificate;
  }

  return certificateId;
};