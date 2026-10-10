const axios = require("axios");

const getCoordinates = async (location) => {
  if (!location || typeof location !== "string") {
    throw new Error("Location is required");
  }

  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: location,
        format: "jsonv2",
        limit: 1,
      },
      headers: {
        "User-Agent": "TripEase/1.0",
      },
    }
  );

  if (!response.data || response.data.length === 0) {
    throw new Error("Location not found");
  }

  const result = response.data[0];

  return {
    formattedAddress: result.display_name,
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };
};

module.exports = {
  getCoordinates,
};