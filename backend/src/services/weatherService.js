const axios = require("axios");

const getWeather = async (city) => {
  if (!city) {
    throw new Error("City is required");
  }

  if (!process.env.WEATHER_API_KEY) {
    throw new Error("Weather API key is not configured");
  }

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: "metric",
      },
    }
  );

  return {
    city: response.data.name,
    country: response.data.sys.country,
    temperature: response.data.main.temp,
    feelsLike: response.data.main.feels_like,
    humidity: response.data.main.humidity,
    description: response.data.weather[0].description,
    windSpeed: response.data.wind.speed,
  };
};

module.exports = {
  getWeather,
};