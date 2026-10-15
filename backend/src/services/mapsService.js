const axios = require("axios");
const ApiError = require("../utils/ApiError");
const getCoordinates = async (location) => {
  if (typeof location !== "string" || !location.trim() || location.trim().length > 150) throw new ApiError(400, "Location must be between 1 and 150 characters");
  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: location.trim(), format: "jsonv2", limit: 1 },
    headers: { "User-Agent": process.env.MAPS_USER_AGENT || "TripEase/1.0 (travel planning application)" },
    timeout: 8000,
  });
  if (!Array.isArray(response.data) || response.data.length === 0) throw new ApiError(404, "Location not found");
  const result = response.data[0];
  return { formattedAddress: result.display_name, latitude: Number(result.lat), longitude: Number(result.lon) };
};
module.exports = { getCoordinates };
