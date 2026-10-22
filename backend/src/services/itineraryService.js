const Itinerary = require("../models/Itinerary");
const Trip = require("../models/Trip");
const ApiError = require("../utils/ApiError");

const verifyTripOwnership = async (userId, tripId) => {
  const trip = await Trip.findOne({ _id: tripId, userId });
  if (!trip) throw new ApiError(404, "Trip not found");
  return trip;
};

const getUtcDay = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, "Invalid itinerary date");
  }

  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
};

const validateItineraryDayAndDate = (trip, day, dateValue) => {
  const start = getUtcDay(trip.startDate);
  const end = getUtcDay(trip.endDate);
  const date = getUtcDay(dateValue);

  if (date < start || date > end) {
    throw new ApiError(400, "Itinerary date must fall within the trip dates");
  }

  const expectedDay = Math.floor((date - start) / 86400000) + 1;

  if (!Number.isInteger(Number(day)) || Number(day) !== expectedDay) {
    throw new ApiError(
      400,
      "Itinerary day must match its date relative to the trip start date"
    );
  }
};

const createItinerary = async (userId, data) => {
  const trip = await verifyTripOwnership(userId, data.tripId);

  validateItineraryDayAndDate(trip, data.day, data.date);

  return Itinerary.create({
    tripId: data.tripId,
    day: data.day,
    date: data.date,
    activities: data.activities,
    userId,
  });
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

  for (const field of ["day", "date", "activities"]) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  if (!Object.keys(updates).length) {
    throw new ApiError(400, "Provide day, date, or activities to update");
  }

  const existing = await Itinerary.findOne({ _id: itineraryId, userId });

  if (!existing) {
    throw new ApiError(404, "Itinerary not found");
  }

  // Validate the resulting day/date pair, including unchanged existing values.
  const trip = await verifyTripOwnership(userId, existing.tripId);
  const resultingDay = updates.day ?? existing.day;
  const resultingDate = updates.date ?? existing.date;

  validateItineraryDayAndDate(trip, resultingDay, resultingDate);

  return Itinerary.findOneAndUpdate(
    { _id: itineraryId, userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
};

const deleteItinerary = async (userId, itineraryId) => {
  const itinerary = await Itinerary.findOneAndDelete({ _id: itineraryId, userId });
  if (!itinerary) throw new ApiError(404, "Itinerary not found");
  return itinerary;
};
module.exports = { createItinerary, getTripItinerary, getDayItinerary, updateItinerary, deleteItinerary };
