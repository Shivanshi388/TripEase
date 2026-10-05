const asyncHandler = require("../utils/asyncHandler");
const budgetService = require("../services/budgetService");

const createExpense = asyncHandler(async (req, res) => {
  const expense = await budgetService.createExpense(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

const getTripExpenses = asyncHandler(async (req, res) => {
  const expenses = await budgetService.getTripExpenses(
    req.user.id,
    req.params.tripId
  );

  res.status(200).json({
    success: true,
    data: expenses,
  });
});

const getBudgetSummary = asyncHandler(async (req, res) => {
  const summary = await budgetService.getBudgetSummary(
    req.user.id,
    req.params.tripId
  );

  res.status(200).json({
    success: true,
    data: summary,
  });
});

const deleteExpense = asyncHandler(async (req, res) => {
  await budgetService.deleteExpense(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});

const getBudgetAnalytics = asyncHandler(async (req, res) => {
  const analytics = await budgetService.getBudgetAnalytics(
    req.user.id,
    req.params.tripId
  );

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

module.exports = {
  createExpense,
  getTripExpenses,
  getBudgetSummary,
  deleteExpense,
  getBudgetAnalytics,
};