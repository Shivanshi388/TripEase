const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");

const {
  createExpenseValidator,
  expenseIdValidator,
} = require("../validators/budgetValidator");

const {
  createExpense,
  getTripExpenses,
  getBudgetSummary,
  deleteExpense,
  getBudgetAnalytics,
} = require("../controllers/budgetController");

// All budget routes require authentication
router.use(authMiddleware);

// Create an expense
router.post(
  "/expenses",
  createExpenseValidator,
  validateMiddleware,
  createExpense
);

// Get all expenses for a trip
router.get("/trips/:tripId/expenses", getTripExpenses);

// Get budget summary for a trip
router.get("/trips/:tripId/summary", getBudgetSummary);

// Delete an expense
router.delete(
  "/expenses/:id",
  expenseIdValidator,
  validateMiddleware,
  deleteExpense
);

router.get(
  "/trips/:tripId/analytics",
  getBudgetAnalytics
);

module.exports = router;