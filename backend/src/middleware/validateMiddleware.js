const { validationResult } = require("express-validator");

const validateMiddleware = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // Do not echo rejected input values (especially passwords) to clients.
    const errors = result.array().map((error) => ({
      type: error.type,
      location: error.location,
      path: error.path || error.param,
      message: error.msg,
    }));
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  return next();
};

module.exports = validateMiddleware;
