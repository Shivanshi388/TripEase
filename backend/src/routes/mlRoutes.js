const express = require("express");
const axios = require("axios");

const router = express.Router();
const ML_SERVICE_URL = (process.env.ML_SERVICE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function forward(req, res, path) {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}${path}`, req.body, {
      timeout: 30000,
      headers: { "Content-Type": "application/json" }
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 502;
    const details = error.response?.data || {
      message: error.code === "ECONNABORTED"
        ? "ML service request timed out"
        : "Could not connect to the ML service",
      code: error.code
    };
    console.error("ML proxy error:", error.message, details);
    return res.status(status).json({
      message: "ML service request failed",
      details
    });
  }
}

router.post("/recommendations/filter", (req, res) =>
  forward(req, res, "/recommendations/"));

router.post("/recommendations/personalized", (req, res) =>
  forward(req, res, "/recommendations/personalized"));

router.post("/itinerary/generate", (req, res) =>
  forward(req, res, "/itinerary/generate"));

router.post("/budget/predict", (req, res) =>
  forward(req, res, "/budget/predict"));

module.exports = router;
