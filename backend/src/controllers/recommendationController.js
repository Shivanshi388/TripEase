const mlService = require("../services/mlService");

const getRecommendations = async (req, res, next) => {
  try {
    const {
      destination,
      budget,
      days,
      interests,
      travelStyle,
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required",
      });
    }

    const result = await mlService.getRecommendations({
      userId: req.user.id,
      destination,
      budget,
      days,
      interests,
      travelStyle,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
