const jwt = require("jsonwebtoken");
const ApiError = require("./ApiError");

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new ApiError(500, "Authentication is not configured on this server");
  }
  return jwt.sign({ id: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    issuer: "tripease-api",
    audience: "tripease-client",
  });
};

module.exports = generateToken;
