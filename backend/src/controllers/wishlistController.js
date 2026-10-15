const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Destination = require("../models/Destination");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user.id }).populate("destination").sort({ createdAt: -1 });
  res.json({ success: true, count: wishlist.length, wishlist });
});
const addToWishlist = asyncHandler(async (req, res) => {
  const destination = req.body?.destination;
  if (!mongoose.isValidObjectId(destination)) throw new ApiError(400, "A valid destination ID is required");
  const exists = await Destination.exists({ _id: destination });
  if (!exists) throw new ApiError(404, "Destination not found");
  try {
    const item = await Wishlist.create({ user: req.user.id, destination });
    await item.populate("destination");
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "Destination already exists in wishlist");
    throw error;
  }
});
const removeFromWishlist = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Invalid wishlist item ID");
  const item = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!item) throw new ApiError(404, "Wishlist item not found");
  res.json({ success: true, message: "Destination removed from wishlist" });
});
module.exports = { getWishlist, addToWishlist, removeFromWishlist };
