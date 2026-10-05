const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");

const recommendationValidator = require("../validators/recommendationValidator");

const {
  getRecommendations,
} = require("../controllers/recommendationController");

router.use(authMiddleware);

router.post(
  "/",
  recommendationValidator,
  validateMiddleware,
  getRecommendations
);

module.exports = router;
