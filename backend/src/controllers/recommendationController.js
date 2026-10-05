const asyncHandler = require("../utils/asyncHandler");
const recommendationService = require("../services/recommendationService");

const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await recommendationService.getRecommendations(
    req.body
  );

  res.status(200).json({
    success: true,
    data: recommendations,
  });
});

module.exports = {
  getRecommendations,
};
