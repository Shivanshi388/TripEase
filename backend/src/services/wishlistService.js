const Wishlist = require("../models/Wishlist");
const Destination = require("../models/Destination");
const ApiError = require("../utils/ApiError");

const getWishlist = async (userId) => {
  return Wishlist.find({ userId })
    .populate("destinationId")
    .sort({ createdAt: -1 });
};

const addToWishlist = async (userId, destinationId) => {
  const destination = await Destination.findById(destinationId);

  if (!destination) {
    throw new ApiError(404, "Destination not found");
  }

  const existing = await Wishlist.findOne({
    userId,
    destinationId,
  });

  if (existing) {
    throw new ApiError(409, "Destination already in wishlist");
  }

  return Wishlist.create({
    userId,
    destinationId,
  });
};

const removeFromWishlist = async (userId, destinationId) => {
  const wishlistItem = await Wishlist.findOneAndDelete({
    userId,
    destinationId,
  });

  if (!wishlistItem) {
    throw new ApiError(404, "Destination not found in wishlist");
  }

  return wishlistItem;
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
