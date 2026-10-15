const { body } = require("express-validator");

const registerValidator = [
  body("name").isString().withMessage("Name is required").bail().trim().isLength({ min: 2, max: 60 }).withMessage("Name must be between 2 and 60 characters"),
  body("email").isString().withMessage("Email is required").bail().trim().isEmail().withMessage("Please enter a valid email address").bail().isLength({ max: 254 }).customSanitizer((value) => value.trim().toLowerCase()),
  body("password").isString().withMessage("Password is required").bail().isLength({ min: 8 }).withMessage("Password must be at least 8 characters").bail().custom((value) => Buffer.byteLength(value, "utf8") <= 72).withMessage("Password must not exceed 72 bytes"),
];
const loginValidator = [
  body("email").isString().withMessage("Email is required").bail().trim().isEmail().withMessage("Please enter a valid email address").customSanitizer((value) => value.trim().toLowerCase()),
  body("password").isString().withMessage("Password is required").bail().notEmpty().withMessage("Password is required").bail().custom((value) => Buffer.byteLength(value, "utf8") <= 72).withMessage("Password must not exceed 72 bytes"),
];
module.exports = { registerValidator, loginValidator };
