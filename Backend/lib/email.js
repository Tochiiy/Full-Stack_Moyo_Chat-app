import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const requiredSmtpVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
];

const buildTransporter = () => {
  const isSmtpConfigured = requiredSmtpVars.every((key) =>
    Boolean(process.env[key]),
  );

  if (!isSmtpConfigured) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendResetCodeEmail = async ({ toEmail, username, resetCode }) => {
  const transporter = buildTransporter();

  if (!transporter) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST/PORT/USER/PASS/FROM in Backend/.env",
    );
  }

  const subject = "MoyoChat password reset code";
  const text = [
    `Hello ${username || "there"},`,
    "",
    "Use this code to reset your password:",
    `${resetCode}`,
    "",
    "This code expires in 15 minutes.",
    "If you did not request this, ignore this email.",
  ].join("\n");

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: toEmail,
    subject,
    text,
  });
};
