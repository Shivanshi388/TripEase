const express = require("express");
const { query } = require("express-validator");

const router = express.Router();

const validateMiddleware = require("../middleware/validateMiddleware");
const { getWeather } = require("../controllers/weatherController");

router.get(
  "/",
  query("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 100 })
    .withMessage("City name is too long"),
  validateMiddleware,
  getWeather
);

module.exports = router;
