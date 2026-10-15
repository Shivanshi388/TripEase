const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("name email createdAt updatedAt");
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, user });
});
const updateMe = asyncHandler(async (req, res) => {
  const updates = {};
  if (req.body.name !== undefined) updates.name = req.body.name.trim();
  if (req.body.email !== undefined) updates.email = req.body.email.trim().toLowerCase();
  if (!Object.keys(updates).length) throw new ApiError(400, "Provide a name or email to update");
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true, runValidators: true, context: "query" }).select("name email createdAt updatedAt");
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "Email is already in use");
    throw error;
  }
});
module.exports = { getMe, updateMe };
