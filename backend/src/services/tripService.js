const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const Itinerary = require("../models/Itinerary");
const ApiError = require("../utils/ApiError");

const TRIP_FIELDS = ["title", "destination", "startDate", "endDate", "budget", "travelers", "status"];
const pick = (source, fields) => Object.fromEntries(fields.filter((field) => source[field] !== undefined).map((field) => [field, source[field]]));
const assertDateOrder = (startDate, endDate) => {
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) throw new ApiError(400, "End date must be on or after start date");
};

const createTrip = async (userId, tripData) => {
  assertDateOrder(tripData.startDate, tripData.endDate);
  return Trip.create({ ...pick(tripData, TRIP_FIELDS), userId });
};
const getUserTrips = async (userId) => Trip.find({ userId }).sort({ createdAt: -1 });
const getTripById = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });
  if (!trip) throw new ApiError(404, "Trip not found");
  return trip;
};
const updateTrip = async (userId, tripId, updateData) => {
  const current = await getTripById(userId, tripId);
  const updates = pick(updateData, TRIP_FIELDS);
  assertDateOrder(updates.startDate || current.startDate, updates.endDate || current.endDate);
  const trip = await Trip.findOneAndUpdate({ _id: tripId, userId }, { $set: updates }, { new: true, runValidators: true });
  if (!trip) throw new ApiError(404, "Trip not found");
  return trip;
};
const deleteTrip = async (userId, tripId) => {
  const trip = await Trip.findOneAndDelete({ _id: tripId, userId });
  if (!trip) throw new ApiError(404, "Trip not found");
  await Promise.all([
    Expense.deleteMany({ tripId: trip._id, userId }),
    Itinerary.deleteMany({ tripId: trip._id, userId }),
  ]);
  return trip;
};
module.exports = { createTrip, getUserTrips, getTripById, updateTrip, deleteTrip };
