const { body } = require("express-validator");

const recommendationValidator = [
  body("destination")
    .trim()
    .notEmpty()
    .withMessage("Destination is required"),

  body("budget")
    .optional()
    .isNumeric()
    .withMessage("Budget must be a number")
    .custom((value) => value >= 0)
    .withMessage("Budget cannot be negative"),

  body("days")
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage("Days must be between 1 and 60"),

  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array"),

  body("travelStyle")
    .optional()
    .isIn(["budget", "balanced", "luxury", "adventure"])
    .withMessage("Invalid travel style"),
];

module.exports = recommendationValidator;
