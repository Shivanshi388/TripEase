const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");

const {
  createTripValidator,
  tripIdValidator,
  updateTripValidator,
} = require("../validators/tripValidator");

const {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");

router.use(authMiddleware);

router.post(
  "/",
  createTripValidator,
  validateMiddleware,
  createTrip
);

router.get("/", getUserTrips);

router.get(
  "/:id",
  tripIdValidator,
  validateMiddleware,
  getTripById
);

router.put(
  "/:id",
  tripIdValidator,
  updateTripValidator,
  validateMiddleware,
  updateTrip
);

router.delete(
  "/:id",
  tripIdValidator,
  validateMiddleware,
  deleteTrip
);

module.exports = router;
