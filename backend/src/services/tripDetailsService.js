const Trip = require("../models/Trip");
const Itinerary = require("../models/Itinerary");
const Expense = require("../models/Expense");
const ApiError = require("../utils/ApiError");

const getTripDetails = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  const [itinerary, expenses] = await Promise.all([
    Itinerary.find({ tripId, userId }).sort({ day: 1, date: 1 }),
    Expense.find({ tripId, userId }).sort({ date: -1 }),
  ]);

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const budget = trip.budget || 0;

  return {
    trip,
    itinerary,
    expenses,
    budgetSummary: {
      budget,
      totalSpent,
      remaining: budget - totalSpent,
      percentageUsed:
        budget > 0 ? Number(((totalSpent / budget) * 100).toFixed(2)) : 0,
    },
  };
};

module.exports = {
  getTripDetails,
};
