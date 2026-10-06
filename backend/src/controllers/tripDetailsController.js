const asyncHandler = require("../utils/asyncHandler");
const tripDetailsService = require("../services/tripDetailsService");

const getTripDetails = asyncHandler(async (req, res) => {
  const details = await tripDetailsService.getTripDetails(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: details,
  });
});

module.exports = {
  getTripDetails,
};
