
const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// Create a trip
router.post("/", async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;