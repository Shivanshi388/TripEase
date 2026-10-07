const Expense = require("../models/Expense");
const Trip = require("../models/Trip");

const getBudgetSummary = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const expenses = await Expense.find({
    userId,
    tripId,
  }).sort({ createdAt: -1 });

  const spent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return {
    tripId: trip._id,
    budget: trip.budget,
    spent,
    remaining: Math.max(trip.budget - spent, 0),
    expenses,
  };
};

const addExpense = async (userId, tripId, expenseData) => {
  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    const error = new Error("Trip not found");
    error.statusCode = 404;
    throw error;
  }

  const { category, description = "", amount } = expenseData;

  if (!category || typeof category !== "string") {
    const error = new Error("Category is required");
    error.statusCode = 400;
    throw error;
  }

  if (amount === undefined || typeof amount !== "number" || amount < 0) {
    const error = new Error("Amount must be a non-negative number");
    error.statusCode = 400;
    throw error;
  }

  const expense = await Expense.create({
    userId,
    tripId,
    category,
    description,
    amount,
  });

  return expense;
};

module.exports = {
  getBudgetSummary,
  addExpense,
};
EOF