const ApiError = require("../utils/ApiError");

const getWeather = async (city) => {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );

  if (!geoResponse.ok) {
    throw new ApiError(502, "Weather geocoding service unavailable");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new ApiError(404, "City not found");
  }

  const location = geoData.results[0];

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
  );

  if (!weatherResponse.ok) {
    throw new ApiError(502, "Weather service unavailable");
  }

  const weather = await weatherResponse.json();

  return {
    location: {
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
    },
    current: weather.current,
    daily: weather.daily,
  };
};

module.exports = {
  getWeather,
};
