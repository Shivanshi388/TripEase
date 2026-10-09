const express = require("express");
const recommendationController = require("../controllers/recommendationController");
const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");
const recommendationValidator = require("../validators/recommendationValidator");
const { recommendationRateLimit } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  recommendationRateLimit,
  recommendationValidator,
  validateMiddleware,
  recommendationController.getRecommendations
);

module.exports = router;
