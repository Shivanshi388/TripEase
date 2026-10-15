const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !/^Bearer\s+\S+$/i.test(authHeader)) {
    return res.status(401).json({ success: false, message: "Authentication required. Please log in." });
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({ success: false, message: "Authentication is not configured on this server." });
  }
  try {
    const token = authHeader.split(/\s+/)[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "tripease-api",
      audience: "tripease-client",
    });
    if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json({ success: false, message: "Invalid authentication token." });
    }
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};
module.exports = authMiddleware;
