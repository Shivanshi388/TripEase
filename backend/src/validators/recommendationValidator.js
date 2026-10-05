const { body } = require("express-validator");

const recommendationValidator = [
  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be non-negative"),

  body("travelers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Travelers must be at least 1"),

  body("duration")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Duration must be between 1 and 365 days"),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array"),

  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array"),

  body("destination")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Destination cannot exceed 150 characters"),
];

module.exports = recommendationValidator;
