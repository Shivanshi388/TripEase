const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

wishlistSchema.index(
  { userId: 1, destinationId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
