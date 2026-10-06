const { getCoordinates } = require("../services/mapsService");
const { getWeather } = require("../services/weatherService");
const express = require("express");
const {
  getDestinations,
  getDestinationById,
} = require("../controllers/destinationController");

const router = express.Router();

router.get("/", getDestinations);

router.get("/weather/:city", async (req, res, next) => {
  try {
    const weather = await getWeather(req.params.city);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

router.get("/coordinates/:location", async (req, res, next) => {
  try {
    const coordinates = await getCoordinates(req.params.location);
    res.json(coordinates);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", getDestinationById);

module.exports = router;