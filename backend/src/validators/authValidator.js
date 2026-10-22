
const { body } = require("express-validator");

const emailField = () =>
  body("email")
    .isString()
    .withMessage("Email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .bail()
    .isLength({ max: 254 })
    .withMessage("Email is too long")
    .customSanitizer((value) => value.trim().toLowerCase());

const passwordField = () =>
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes");

const registerValidator = [
  body("name")
    .isString()
    .withMessage("Name is required")
    .bail()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  emailField(),
  passwordField(),
];

const loginValidator = [
  emailField(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes"),
];

const verifyEmailValidator = [
  body("token")
    .isString()
    .withMessage("Verification token is required")
    .bail()
    .notEmpty()
    .withMessage("Verification token is required"),
];

const resendVerificationValidator = [emailField()];
const forgotPasswordValidator = [emailField()];

const resetPasswordValidator = [
  body("token")
    .isString()
    .withMessage("Reset token is required")
    .bail()
    .notEmpty()
    .withMessage("Reset token is required"),
  passwordField(),
];

module.exports = {
  registerValidator,
  loginValidator,
  verifyEmailValidator,
  resendVerificationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
