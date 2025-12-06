import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter;

// Detect test environment safely (Jest or NODE_ENV=test)
const isTestEnv =
  process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined;

if (isTestEnv) {
  // Mock transporter for tests — no real emails are sent
  transporter = {
    sendMail: async (options: any) => {
      console.log("[TEST MODE] Email would be sent to:", options.to);
      return { accepted: [options.to], rejected: [] }; // mock success
    },
  };
} else {
  // Real transporter for development or production
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
}

export const sendEmail = async (to: string, subject: string, html?: string) => {
  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      html,
    };

    const mailRes = await transporter.sendMail(mailOptions);
    console.log("Message sent:", mailRes);

    if (mailRes.accepted?.length > 0) return "Email sent successfully";
    if (mailRes.rejected?.length > 0) return "Email not sent";

    return "Email server not responding";
  } catch (error: any) {
    console.log("Error sending email:", error.message);
    return JSON.stringify(error.message);
  }
};
