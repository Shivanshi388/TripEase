const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

const register = async ({ name, email, password }) => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  if (cleanName.length < 2 || cleanName.length > 60) throw new ApiError(400, "Name must be between 2 and 60 characters");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) throw new ApiError(400, "Please enter a valid email address");
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) throw new ApiError(400, "Password must be at least 8 characters and no more than 72 bytes");
  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await User.create({ name: cleanName, email: cleanEmail, passwordHash });
  } catch (error) {
    if (error.code === 11000) throw new ApiError(409, "An account with this email already exists");
    throw error;
  }
  return { id: user._id, name: user.name, email: user.email };
};

const login = async ({ email, password }) => {
  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail }).select("+passwordHash");
  const matches = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!matches) throw new ApiError(401, "Invalid email or password");
  return {
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  };
};

module.exports = { register, login };
