const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const ApiError = require("../utils/ApiError");

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
    ...expenseData,
    userId,
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

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const budget = trip.budget || 0;
  const remaining = budget - totalSpent;

  const categoryTotals = {};

  expenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const percentageUsed =
    budget > 0 ? Number(((totalSpent / budget) * 100).toFixed(2)) : 0;

  return {
    budget,
    totalSpent,
    remaining,
    percentageUsed,
    categoryTotals,
    expenseCount: expenses.length,
  };
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

module.exports = {
  createExpense,
  getTripExpenses,
  getBudgetSummary,
  deleteExpense,
  getBudgetAnalytics,
};