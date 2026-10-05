const Destination = require("../models/Destination");
const ApiError = require("../utils/ApiError");

const getDestinations = async ({ search, category, minBudget, maxBudget }) => {
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (minBudget !== undefined || maxBudget !== undefined) {
    filter.budgetMin = {};

    if (minBudget !== undefined) {
      filter.budgetMin.$gte = Number(minBudget);
    }

    if (maxBudget !== undefined) {
      filter.budgetMin.$lte = Number(maxBudget);
    }
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  return Destination.find(filter).sort({
    rating: -1,
    name: 1,
  });
};

const getDestinationById = async (destinationId) => {
  const destination = await Destination.findById(destinationId);

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  return destination;
};

module.exports = {
  getDestinations,
  getDestinationById,
};
