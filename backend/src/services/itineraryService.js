const Itinerary = require("../models/Itinerary");
const Trip = require("../models/Trip");
const ApiError = require("../utils/ApiError");

const verifyTripOwnership = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    userId,
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  return trip;
};

const createItinerary = async (userId, itineraryData) => {
  await verifyTripOwnership(userId, itineraryData.tripId);

  return Itinerary.create({
    ...itineraryData,
    userId,
  });
};

const getTripItinerary = async (userId, tripId) => {
  await verifyTripOwnership(userId, tripId);

  return Itinerary.find({
    tripId,
    userId,
  }).sort({ day: 1, date: 1 });
};

const getDayItinerary = async (userId, tripId, day) => {
  await verifyTripOwnership(userId, tripId);

  return Itinerary.findOne({
    tripId,
    userId,
    day,
  });
};

const updateItinerary = async (
  userId,
  itineraryId,
  updateData
) => {
  const itinerary = await Itinerary.findOneAndUpdate(
    {
      _id: itineraryId,
      userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  return itinerary;
};

const deleteItinerary = async (userId, itineraryId) => {
  const itinerary = await Itinerary.findOneAndDelete({
    _id: itineraryId,
    userId,
  });

  if (!itinerary) {
    throw new ApiError(404, "Itinerary not found");
  }

  return itinerary;
};

module.exports = {
  createItinerary,
  getTripItinerary,
  getDayItinerary,
  updateItinerary,
  deleteItinerary,
};
