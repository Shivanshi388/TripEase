const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Email configuration is missing: ${missing.join(", ")}`
    );
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  return getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

async function sendVerificationEmail(email, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${baseUrl}/#verify-email?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: "Verify your TripEase email",
    text: `Verify your TripEase email using this link: ${link}\nThis link expires in 30 minutes.`,
    html: `<p>Welcome to TripEase!</p><p><a href="${link}">Verify your email address</a></p><p>This link expires in 30 minutes.</p>`,
  });
}

async function sendPasswordResetEmail(email, token) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${baseUrl}/#reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: "Reset your TripEase password",
    text: `Reset your TripEase password using this link: ${link}\nThis link expires in 15 minutes.`,
    html: `<p>We received a request to reset your TripEase password.</p><p><a href="${link}">Reset your password</a></p><p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
