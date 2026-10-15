const Itinerary = require("../models/Itinerary");
const Trip = require("../models/Trip");
const ApiError = require("../utils/ApiError");

const verifyTripOwnership = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });
  if (!trip) throw new ApiError(404, "Trip not found");
  return trip;
};
const createItinerary = async (userId, data) => {
  const trip = await verifyTripOwnership(userId, data.tripId);
  const start = new Date(trip.startDate); start.setHours(0, 0, 0, 0);
  const end = new Date(trip.endDate); end.setHours(0, 0, 0, 0);
  const date = new Date(data.date); date.setHours(0, 0, 0, 0);
  const tripDays = Math.floor((end - start) / 86400000) + 1;
  if (date < start || date > end || Number(data.day) > tripDays) {
    throw new ApiError(400, "Itinerary date and day must fall within the trip dates");
  }
  return Itinerary.create({ tripId: data.tripId, day: data.day, date: data.date, activities: data.activities, userId });
};
const getTripItinerary = async (userId, tripId) => {
  await verifyTripOwnership(userId, tripId);
  return Itinerary.find({ tripId, userId }).sort({ day: 1, date: 1 });
};
const getDayItinerary = async (userId, tripId, day) => {
  await verifyTripOwnership(userId, tripId);
  return Itinerary.findOne({ tripId, userId, day: Number(day) });
};
const updateItinerary = async (userId, itineraryId, data) => {
  const updates = {};
  for (const field of ["day", "date", "activities"]) if (data[field] !== undefined) updates[field] = data[field];
  if (!Object.keys(updates).length) throw new ApiError(400, "Provide day, date, or activities to update");
  const existing = await Itinerary.findOne({ _id: itineraryId, userId });
  if (!existing) throw new ApiError(404, "Itinerary not found");
  if (updates.day !== undefined || updates.date !== undefined) {
    const trip = await verifyTripOwnership(userId, existing.tripId);
    const day = Number(updates.day ?? existing.day);
    const start = new Date(trip.startDate); start.setHours(0, 0, 0, 0);
    const end = new Date(trip.endDate); end.setHours(0, 0, 0, 0);
    const date = new Date(updates.date ?? existing.date); date.setHours(0, 0, 0, 0);
    const tripDays = Math.floor((end - start) / 86400000) + 1;
    if (day < 1 || day > tripDays || date < start || date > end) throw new ApiError(400, "Itinerary date and day must fall within the trip dates");
  }
  return Itinerary.findOneAndUpdate({ _id: itineraryId, userId }, { $set: updates }, { new: true, runValidators: true });
};
const deleteItinerary = async (userId, itineraryId) => {
  const itinerary = await Itinerary.findOneAndDelete({ _id: itineraryId, userId });
  if (!itinerary) throw new ApiError(404, "Itinerary not found");
  return itinerary;
};
module.exports = { createItinerary, getTripItinerary, getDayItinerary, updateItinerary, deleteItinerary };
