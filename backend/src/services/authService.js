
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("./emailService");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createToken = () => crypto.randomBytes(32).toString("hex");

const validatePassword = (password) => {
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters and no more than 72 bytes"
    );
  }
};

const register = async ({ name, email, password }) => {
  if (typeof name !== "string" || typeof email !== "string") {
    throw new ApiError(400, "Name and email are required");
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 60) {
    throw new ApiError(400, "Name must be between 2 and 60 characters");
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    cleanEmail.length > 254
  ) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  validatePassword(password);

  const passwordHash = await bcrypt.hash(password, 12);
  const verificationToken = createToken();

  let user;

  try {
    user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      isEmailVerified: false,
      emailVerificationTokenHash: hashToken(verificationToken),
      emailVerificationExpires: new Date(Date.now() + 30 * 60 * 1000),
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "An account with this email already exists");
    }
    throw error;
  }

  try {
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error("Verification email could not be sent:", error.message);
    throw new ApiError(
      503,
      "Your account was created, but the verification email could not be sent. Please request another verification email."
    );
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    message: "Account created. Please check your email to verify your account.",
  };
};

const verifyEmail = async (token) => {
  if (typeof token !== "string" || !token) {
    throw new ApiError(400, "Verification token is required");
  }

  const user = await User.findOne({
    emailVerificationTokenHash: hashToken(token),
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Verification link is invalid or expired");
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { message: "Email verified successfully. You can now log in." };
};

const resendVerificationEmail = async ({ email }) => {
  if (typeof email !== "string") {
    throw new ApiError(400, "Please enter a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  // Use the same response whether the account exists or is already verified.
  const result = {
    message: "If your account needs verification, an email will be sent.",
  };

  if (!user || user.isEmailVerified) return result;

  const verificationToken = createToken();

  user.emailVerificationTokenHash = hashToken(verificationToken);
  user.emailVerificationExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  try {
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error("Resend verification email failed:", { message: error.message, name: error.name, cause: error.cause, stack: error.stack });
    throw new ApiError(503, "Unable to send the email right now. Please try again later.");
  }

  return result;
};

const login = async ({ email, password }) => {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new ApiError(400, "Email and password are required");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail }).select("+passwordHash");
  const matches = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!matches) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in. Check your inbox or request a new verification email."
    );
  }

  return {
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  };
};

const forgotPassword = async ({ email }) => {
  if (typeof email !== "string") {
    throw new ApiError(400, "Please enter a valid email address");
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  const result = {
    message: "If an account exists for that email, a password reset link will be sent.",
  };

  if (!user) return result;

  const resetToken = createToken();

  user.passwordResetTokenHash = hashToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (error) {
    console.error("Password reset email failed:", error.message);
    throw new ApiError(503, "Unable to send the reset email right now. Please try again later.");
  }

  return result;
};

const resetPassword = async ({ token, password }) => {
  if (typeof token !== "string" || !token) {
    throw new ApiError(400, "Reset token is required");
  }

  validatePassword(password);

  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset link is invalid or expired");
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return { message: "Password reset successfully. You can now log in." };
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
};

