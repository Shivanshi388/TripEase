const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");
const { tripIdValidator } = require("../validators/tripValidator");
const { getTripDetails } = require("../controllers/tripDetailsController");

router.use(authMiddleware);

router.get(
  "/:id",
  tripIdValidator,
  validateMiddleware,
  getTripDetails
);

module.exports = router;
