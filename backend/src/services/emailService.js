async function sendEmail({ to, subject, text, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `Resend API error (${response.status}): ${
        result.message || JSON.stringify(result)
      }`
    );
  }

  return result;
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
