const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");

const {
  createItineraryValidator,
  itineraryIdValidator,
  tripItineraryValidator,
  dayItineraryValidator,
} = require("../validators/itineraryValidator");

const {
  createItinerary,
  getTripItinerary,
  getDayItinerary,
  updateItinerary,
  deleteItinerary,
} = require("../controllers/itineraryController");

router.use(authMiddleware);

router.post(
  "/",
  createItineraryValidator,
  validateMiddleware,
  createItinerary
);

router.get(
  "/trip/:tripId",
  tripItineraryValidator,
  validateMiddleware,
  getTripItinerary
);

router.get(
  "/trip/:tripId/day/:day",
  dayItineraryValidator,
  validateMiddleware,
  getDayItinerary
);

router.put(
  "/:id",
  itineraryIdValidator,
  validateMiddleware,
  updateItinerary
);

router.delete(
  "/:id",
  itineraryIdValidator,
  validateMiddleware,
  deleteItinerary
);

module.exports = router;
