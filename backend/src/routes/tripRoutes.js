
const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All trip routes require authentication
router.use(authMiddleware);

// Create a trip for the logged-in user
router.post("/", async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      budget,
      travelers = 1,
      itinerary = [],
      status = "planned",
    } = req.body || {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof destination !== "string" ||
      !destination.trim() ||
      !startDate ||
      !endDate ||
      budget === undefined
    ) {
      return res.status(400).json({
        message: "Title, destination, dates and budget are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return res.status(400).json({
        message: "Please provide valid travel dates.",
      });
    }

    if (
      typeof budget !== "number" ||
      !Number.isFinite(budget) ||
      budget < 0
    ) {
      return res.status(400).json({
        message: "Budget must be a non-negative number.",
      });
    }

    if (
      !Number.isInteger(travelers) ||
      travelers < 1 ||
      travelers > 20
    ) {
      return res.status(400).json({
        message: "Travelers must be a whole number between 1 and 20.",
      });
    }

    if (
      !Array.isArray(itinerary) ||
      itinerary.length > 30 ||
      itinerary.some(
        (day) =>
          !day ||
          !Number.isInteger(day.day) ||
          !Array.isArray(day.activities) ||
          day.activities.length > 20 ||
          day.activities.some(
            (activity) =>
              typeof activity !== "string" ||
              activity.length > 200
          )
      )
    ) {
      return res.status(400).json({
        message: "Invalid itinerary format.",
      });
    }

    if (!["planned", "ongoing", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid trip status.",
      });
    }

    const trip = await Trip.create({
      userId: req.user.id,
      title: title.trim(),
      destination: destination.trim(),
      startDate: start,
      endDate: end,
      budget,
      travelers,
      itinerary,
      status,
    });

    return res.status(201).json({
      message: "Trip created successfully.",
      trip,
    });
  } catch (error) {
    console.error("Create trip error:", error.message);

    return res.status(500).json({
      message: "Unable to create trip right now.",
    });
  }
});

// Get only the logged-in user's trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error("Fetch trips error:", error.message);

    return res.status(500).json({
      message: "Unable to fetch trips right now.",
    });
  }
});

module.exports = router;