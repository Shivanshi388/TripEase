const { body, param } = require("express-validator");

const createTripValidator = [
  body("title")
    .notEmpty()
    .withMessage("Trip title is required")
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Trip title cannot exceed 150 characters"),

  body("destination")
    .notEmpty()
    .withMessage("Destination is required")
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Destination cannot exceed 150 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date"),

  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be non-negative"),

  body("travelers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Travelers must be at least 1"),
];

const tripIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid trip ID"),
];

const updateTripValidator = [
  body("title")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Trip title cannot exceed 150 characters"),

  body("destination")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Destination cannot exceed 150 characters"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid end date"),

  body("budget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Budget must be non-negative"),

  body("travelers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Travelers must be at least 1"),

  body("status")
    .optional()
    .isIn(["planned", "ongoing", "completed", "cancelled"])
    .withMessage("Invalid trip status"),
];

module.exports = {
  createTripValidator,
  tripIdValidator,
  updateTripValidator,
};
