const express = require("express");
const recommendationController = require("../controllers/recommendationController");

const router = express.Router();

router.post("/", recommendationController.getRecommendations);

module.exports = router;
