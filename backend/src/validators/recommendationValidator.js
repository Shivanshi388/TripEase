const { body } = require("express-validator");

const recommendationValidator = [
  body("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required")
    .isLength({ max: 100 })
    .withMessage("Destination must be at most 100 characters"),

  body("budget")
    .notEmpty()
    .withMessage("Budget is required")
    .isFloat({ min: 0 })
    .withMessage("Budget must be a non-negative number"),

  body("days")
    .notEmpty()
    .withMessage("Days is required")
    .isInt({ min: 1, max: 365 })
    .withMessage("Days must be between 1 and 365"),

  body("interests")
    .optional()
    .isArray({ max: 20 })
    .withMessage("Interests must be an array with at most 20 items"),

  body("interests.*")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each interest must be at most 50 characters"),

  body("travelStyle")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Travel style must be at most 30 characters")
];

module.exports = recommendationValidator;
