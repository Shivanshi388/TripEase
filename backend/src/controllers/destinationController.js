const asyncHandler = require("../utils/asyncHandler");
const destinationService = require("../services/destinationService");

const getDestinations = asyncHandler(async (req, res) => {
  const destinations = await destinationService.getDestinations({
    search: req.query.search,
    category: req.query.category,
    minBudget: req.query.minBudget,
    maxBudget: req.query.maxBudget,
  });

  res.status(200).json({
    success: true,
    data: destinations,
  });
});

const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await destinationService.getDestinationById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: destination,
  });
});

module.exports = {
  getDestinations,
  getDestinationById,
};
