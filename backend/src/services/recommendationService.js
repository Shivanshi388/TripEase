const ApiError = require("../utils/ApiError");

const getRecommendations = async (preferences) => {
  const mlServiceUrl = process.env.ML_SERVICE_URL;

  if (!mlServiceUrl) {
    throw new ApiError(
      503,
      "Recommendation service is not configured yet"
    );
  }

  const response = await fetch(`${mlServiceUrl}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new ApiError(
      502,
      "Recommendation service unavailable"
    );
  }

  const result = await response.json();

  return result;
};

module.exports = {
  getRecommendations,
};
