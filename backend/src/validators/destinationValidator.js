const { query, param } = require("express-validator");

const destinationsQueryValidator = [
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters"),

  query("category")
    .optional()
    .isIn([
      "heritage",
      "nature",
      "adventure",
      "beach",
      "spiritual",
      "city",
      "wildlife",
      "other",
    ])
    .withMessage("Invalid destination category"),

  query("minBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum budget must be non-negative"),

  query("maxBudget")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum budget must be non-negative"),
];

const destinationIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid destination ID"),
];

module.exports = {
  destinationsQueryValidator,
  destinationIdValidator,
};
