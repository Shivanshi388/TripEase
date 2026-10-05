const asyncHandler = require("../utils/asyncHandler");
const wishlistService = require("../services/wishlistService");

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

const addToWishlist = asyncHandler(async (req, res) => {
  const wishlistItem = await wishlistService.addToWishlist(
    req.user.id,
    req.body.destinationId
  );

  const populatedItem = await wishlistItem.populate("destinationId");

  res.status(201).json({
    success: true,
    message: "Destination added to wishlist",
    data: populatedItem,
  });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  await wishlistService.removeFromWishlist(
    req.user.id,
    req.params.destinationId
  );

  res.status(200).json({
    success: true,
    message: "Destination removed from wishlist",
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
