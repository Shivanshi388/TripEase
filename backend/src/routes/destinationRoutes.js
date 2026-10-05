const express = require("express");
const router = express.Router();

const validateMiddleware = require("../middleware/validateMiddleware");

const {
  destinationsQueryValidator,
  destinationIdValidator,
} = require("../validators/destinationValidator");

const {
  getDestinations,
  getDestinationById,
} = require("../controllers/destinationController");

router.get(
  "/",
  destinationsQueryValidator,
  validateMiddleware,
  getDestinations
);

router.get(
  "/:id",
  destinationIdValidator,
  validateMiddleware,
  getDestinationById
);

module.exports = router;
