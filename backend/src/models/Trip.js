
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      min: 0,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
      min: 1,
    },
    itinerary: [
      {
        day: Number,
        activities: [String],
      },
    ],
    status: {
      type: String,
      enum: ["planned", "ongoing", "completed"],
      default: "planned",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);