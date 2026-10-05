const asyncHandler = require("../utils/asyncHandler");
const weatherService = require("../services/weatherService");

const getWeather = asyncHandler(async (req, res) => {
  const { city } = req.query;

  if (!city || !city.trim()) {
    return res.status(400).json({
      success: false,
      message: "City is required",
    });
  }

  const weather = await weatherService.getWeather(city.trim());

  res.status(200).json({
    success: true,
    data: weather,
  });
});

module.exports = {
  getWeather,
};
