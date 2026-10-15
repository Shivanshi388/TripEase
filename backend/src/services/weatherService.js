const axios = require("axios");
const ApiError = require("../utils/ApiError");
const getWeather = async (city) => {
  if (typeof city !== "string" || !city.trim() || city.trim().length > 100) throw new ApiError(400, "City must be between 1 and 100 characters");
  if (!process.env.WEATHER_API_KEY) throw new ApiError(503, "Weather service is not configured");
  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { q: city.trim(), appid: process.env.WEATHER_API_KEY, units: "metric" }, timeout: 8000,
    });
    const data = response.data;
    return { city: data.name, country: data.sys.country, temperature: data.main.temp, feelsLike: data.main.feels_like, humidity: data.main.humidity, description: data.weather?.[0]?.description || "", windSpeed: data.wind.speed };
  } catch (error) {
    if (error.response?.status === 404) throw new ApiError(404, "Weather was not found for that city");
    if (error.response?.status === 401) throw new ApiError(503, "Weather service credentials are invalid");
    throw new ApiError(502, "Weather service is temporarily unavailable");
  }
};
module.exports = { getWeather };
