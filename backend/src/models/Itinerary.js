const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    day: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

    activities: [
      {
        time: {
          type: String,
          trim: true,
        },

        title: {
          type: String,
          required: true,
          trim: true,
          maxlength: 150,
        },

        description: {
          type: String,
          trim: true,
          maxlength: 500,
        },

        location: {
          type: String,
          trim: true,
          maxlength: 200,
        },

        duration: {
          type: Number,
          min: 0,
        },

        estimatedCost: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

itinerarySchema.index({ tripId: 1, day: 1 });

module.exports = mongoose.model("Itinerary", itinerarySchema);
