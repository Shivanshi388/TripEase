const Wishlist = require("../models/Wishlist");

const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.find({ user: req.user.id })
    .populate("destination")
    .sort({ createdAt: -1 });

  res.json({
    count: wishlist.length,
    wishlist,
  });
};

const addToWishlist = async (req, res) => {
  const { destination } = req.body;

  if (!destination) {
    return res.status(400).json({
      message: "Destination is required",
    });
  }

  try {
    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      destination,
    });

    const populatedItem = await wishlistItem.populate("destination");

    res.status(201).json(populatedItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Destination already exists in wishlist",
      });
    }

    throw error;
  }
};

const removeFromWishlist = async (req, res) => {
  const deletedItem = await Wishlist.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!deletedItem) {
    return res.status(404).json({
      message: "Wishlist item not found",
    });
  }

  res.json({
    message: "Destination removed from wishlist",
  });
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};