const { body, param } = require("express-validator");
const createExpenseValidator = [
  body("tripId").isMongoId().withMessage("Invalid trip ID"),
  body("category").isIn(["accommodation", "transportation", "food", "activities", "shopping", "other"]).withMessage("Invalid expense category"),
  body("description").optional().isString().withMessage("Description must be a string").bail().trim().isLength({ max: 200 }).withMessage("Description cannot exceed 200 characters"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be non-negative").toFloat(),
  body("currency").optional().isString().withMessage("Currency must be a string").bail().matches(/^[A-Za-z]{3}$/).withMessage("Currency must be a 3-letter code").toUpperCase(),
  body("date").optional().isISO8601().withMessage("Invalid date"),
];
const expenseIdValidator = [param("id").isMongoId().withMessage("Invalid expense ID")];
const tripExpenseValidator = [param("tripId").isMongoId().withMessage("Invalid trip ID")];
module.exports = { createExpenseValidator, expenseIdValidator, tripExpenseValidator };
