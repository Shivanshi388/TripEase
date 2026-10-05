const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const ApiError = require("../utils/ApiError");

const createTrip = async (userId, tripData) => {
  return Trip.create({
    ...tripData,
    userId,
  });
};

const getUserTrips = async (userId) => {
  return Trip.find({ userId }).sort({ createdAt: -1 });
};

const getTripById = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  return trip;
};

const updateTrip = async (userId, tripId, updateData) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: tripId, userId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  return trip;
};

const deleteTrip = async (userId, tripId) => {
  const trip = await Trip.findOneAndDelete({
    _id: tripId,
    userId,
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  await Expense.deleteMany({
    tripId: trip._id,
    userId,
  });

  return trip;
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
