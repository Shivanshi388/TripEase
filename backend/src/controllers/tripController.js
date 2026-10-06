const asyncHandler = require("../utils/asyncHandler");
const tripService = require("../services/tripService");

const createTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.createTrip(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: "Trip created successfully",
    data: trip,
  });
});

const getUserTrips = asyncHandler(async (req, res) => {
  const trips = await tripService.getUserTrips(req.user.id);

  res.status(200).json({
    success: true,
    data: trips,
  });
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: trip,
  });
});

const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(
    req.user.id,
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Trip updated successfully",
    data: trip,
  });
});

const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.user.id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Trip deleted successfully",
  });
});

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
