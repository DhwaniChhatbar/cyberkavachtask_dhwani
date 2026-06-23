import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (
  to,
  subject,
  text = "",
  html = ""
) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    const mailOptions = {
      from: `"Campus Event Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      `Email sent successfully: ${info.messageId}`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "Email sending failed:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;