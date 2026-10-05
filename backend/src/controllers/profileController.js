const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Trip = require("../models/Trip");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name email createdAt");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const [totalTrips, completedTrips] = await Promise.all([
    Trip.countDocuments({ userId: req.user.id }),
    Trip.countDocuments({
      userId: req.user.id,
      status: "completed",
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      user,
      stats: {
        totalTrips,
        completedTrips,
      },
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    {
      new: true,
      runValidators: true,
    }
  ).select("_id name email createdAt");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

module.exports = {
  getProfile,
  updateProfile,
};
