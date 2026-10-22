
const express = require("express");

const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
  verifyEmailValidator,
  resendVerificationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");

const validateMiddleware = require("../middleware/validateMiddleware");
const { authRateLimit } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post(
  "/register",
  authRateLimit,
  registerValidator,
  validateMiddleware,
  register
);

router.post(
  "/login",
  authRateLimit,
  loginValidator,
  validateMiddleware,
  login
);

router.post(
  "/verify-email",
  authRateLimit,
  verifyEmailValidator,
  validateMiddleware,
  verifyEmail
);

router.post(
  "/resend-verification",
  authRateLimit,
  resendVerificationValidator,
  validateMiddleware,
  resendVerificationEmail
);

router.post(
  "/forgot-password",
  authRateLimit,
  forgotPasswordValidator,
  validateMiddleware,
  forgotPassword
);

router.post(
  "/reset-password",
  authRateLimit,
  resetPasswordValidator,
  validateMiddleware,
  resetPassword
);

module.exports = router;
