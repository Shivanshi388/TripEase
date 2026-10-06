const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const buildFallbackRecommendations = (payload) => {
  const {
    destination,
    budget,
    days,
    interests = [],
    travelStyle = "balanced",
  } = payload;

  const parsedBudget = Number(budget) || 0;
  const parsedDays = Number(days) || 1;

  return {
    type: "fallback",
    destination,
    days: parsedDays,
    budget: parsedBudget,
    travelStyle,
    interests: Array.isArray(interests) ? interests : [interests],
    suggestions: [
      {
        title: `Explore ${destination}`,
        reason: "Balanced option based on your requested destination.",
      },
      {
        title: "Local experiences",
        reason: "Add cultural attractions, local food, and popular activities.",
      },
      {
        title: "Flexible itinerary",
        reason: `Plan approximately ${parsedDays} day(s) while keeping spending within your budget.`,
      },
    ],
  };
};

const getRecommendations = async (payload) => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/recommend`,
      payload,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      type: "ml",
      ...response.data,
    };
  } catch (error) {
    console.warn("ML service unavailable. Using fallback recommendations.");

    return buildFallbackRecommendations(payload);
  }
};

module.exports = {
  getRecommendations,
  buildFallbackRecommendations,
};
