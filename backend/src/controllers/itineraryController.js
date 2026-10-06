const asyncHandler = require("../utils/asyncHandler");
const itineraryService = require("../services/itineraryService");

const createItinerary = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.createItinerary(
    req.user.id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Itinerary created successfully",
    data: itinerary,
  });
});

const getTripItinerary = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.getTripItinerary(
    req.user.id,
    req.params.tripId
  );

  res.status(200).json({
    success: true,
    data: itinerary,
  });
});

const getDayItinerary = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.getDayItinerary(
    req.user.id,
    req.params.tripId,
    req.params.day
  );

  res.status(200).json({
    success: true,
    data: itinerary,
  });
});

const updateItinerary = asyncHandler(async (req, res) => {
  const itinerary = await itineraryService.updateItinerary(
    req.user.id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Itinerary updated successfully",
    data: itinerary,
  });
});

const deleteItinerary = asyncHandler(async (req, res) => {
  await itineraryService.deleteItinerary(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Itinerary deleted successfully",
  });
});

module.exports = {
  createItinerary,
  getTripItinerary,
  getDayItinerary,
  updateItinerary,
  deleteItinerary,
};
