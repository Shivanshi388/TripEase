const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

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

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `ML service error: ${error.response.status} ${error.response.statusText}`
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("ML service request timed out");
    }

    throw new Error("ML service is unavailable");
  }
};

module.exports = {
  getRecommendations,
};
