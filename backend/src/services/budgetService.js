const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const ApiError = require("../utils/ApiError");

const calculateBudgetSummary = (budget, expenses) => {
  const totalSpent = expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
  const categoryTotals = {};
  expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + Number(expense.amount || 0);
  });
  return {
    budget,
    totalSpent,
    remaining: budget - totalSpent,
    percentageUsed: budget > 0 ? Number(((totalSpent / budget) * 100).toFixed(2)) : 0,
    categoryTotals,
    expenseCount: expenses.length,
  };
};

const createExpense = async (userId, expenseData) => {
  const { tripId } = expenseData;

  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  const expense = await Expense.create({
    tripId: expenseData.tripId,
    userId,
    category: expenseData.category,
    description: expenseData.description,
    amount: expenseData.amount,
    currency: expenseData.currency || "INR",
    date: expenseData.date,
  });

  return expense;
};

const getTripExpenses = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  return Expense.find({
    tripId,
    userId,
  }).sort({ date: -1 });
};

const getBudgetSummary = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  const expenses = await Expense.find({
    tripId,
    userId,
  });

  return calculateBudgetSummary(trip.budget || 0, expenses);
};

const deleteExpense = async (userId, expenseId) => {
  const expense = await Expense.findOneAndDelete({
    _id: expenseId,
    userId,
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

const getBudgetAnalytics = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  const expenses = await Expense.find({
    tripId,
    userId,
  }).sort({ date: 1 });

  const dailySpending = {};

  expenses.forEach((expense) => {
    const date = expense.date.toISOString().split("T")[0];

    dailySpending[date] =
      (dailySpending[date] || 0) + expense.amount;
  });

  const categoryTotals = {};

  expenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return {
    tripId,
    budget: trip.budget || 0,
    totalSpent,
    dailySpending,
    categoryTotals,
  };
};

const getBudgetAlerts = async (userId, tripId) => {
  const summary = await getBudgetSummary(userId, tripId);

  const alerts = [];

  if (summary.budget <= 0) {
    return {
      status: "no_budget",
      alerts: ["No budget has been set for this trip."],
    };
  }

  if (summary.percentageUsed >= 100) {
    alerts.push("Budget exceeded.");
  } else if (summary.percentageUsed >= 90) {
    alerts.push("You have used more than 90% of your budget.");
  } else if (summary.percentageUsed >= 75) {
    alerts.push("You have used more than 75% of your budget.");
  }

  return {
    status:
      summary.percentageUsed >= 100
        ? "exceeded"
        : summary.percentageUsed >= 75
        ? "warning"
        : "safe",
    alerts,
    budget: summary.budget,
    totalSpent: summary.totalSpent,
    remaining: summary.remaining,
    percentageUsed: summary.percentageUsed,
  };
};

module.exports = {
  createExpense,
  getTripExpenses,
  getBudgetSummary,
  deleteExpense,
  getBudgetAnalytics,
  getBudgetAlerts,
  calculateBudgetSummary,
};