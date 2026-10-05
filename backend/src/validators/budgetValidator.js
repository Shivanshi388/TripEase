const { body, param } = require("express-validator");

const createExpenseValidator = [
  body("tripId")
    .notEmpty()
    .withMessage("Trip ID is required")
    .isMongoId()
    .withMessage("Invalid trip ID"),

  body("category")
    .notEmpty()
    .withMessage("Expense category is required")
    .isIn([
      "accommodation",
      "transportation",
      "food",
      "activities",
      "shopping",
      "other",
    ])
    .withMessage("Invalid expense category"),

  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("currency")
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Invalid date"),
];

const expenseIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid expense ID"),
];

module.exports = {
  createExpenseValidator,
  expenseIdValidator,
};