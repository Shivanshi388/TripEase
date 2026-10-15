const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Destination = require("../models/Destination");
const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await Destination.find().sort({ name: 1 }).lean();
  res.json({ success: true, count: destinations.length, destinations });
});
const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id).lean();
  if (!destination) throw new ApiError(404, "Destination not found");
  res.json(destination);
});
module.exports = { getDestinations, getDestinationById };
