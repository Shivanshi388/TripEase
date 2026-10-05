const mlService = require("../services/mlService");
const Trip = require("../models/Trip");

const getRecommendations = async (req, res, next) => {
  try {
    const {
      destination,
      budget,
      days,
      interests,
      travelStyle,
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required",
      });
    }

    const trips = await Trip.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("destination budget travelers status itinerary startDate endDate -_id")
      .lean();

    const tripHistory = trips.map((trip) => ({
      destination: trip.destination,
      budget: trip.budget,
      travelers: trip.travelers,
      status: trip.status,
      itinerary: trip.itinerary || [],
      startDate: trip.startDate,
      endDate: trip.endDate,
    }));

    const result = await mlService.getRecommendations({
      userId: req.user.id,
      destination,
      budget,
      days,
      interests,
      travelStyle,
      tripHistory,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
