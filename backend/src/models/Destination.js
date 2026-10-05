const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      index: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
      default: "India",
    },

    state: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "heritage",
        "nature",
        "adventure",
        "beach",
        "spiritual",
        "city",
        "wildlife",
        "other",
      ],
      default: "other",
      index: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    bestTime: {
      type: String,
      trim: true,
    },

    budgetMin: {
      type: Number,
      min: 0,
      default: 0,
    },

    budgetMax: {
      type: Number,
      min: 0,
      default: 0,
    },

    attractions: {
      type: [String],
      default: [],
    },

    activities: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

destinationSchema.index({
  name: "text",
  description: "text",
  state: "text",
  tags: "text",
});

module.exports = mongoose.model("Destination", destinationSchema);
