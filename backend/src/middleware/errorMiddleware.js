const ApiError = require("../utils/ApiError");

const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "Internal server error";
  let details;

  if (error.message === "Origin is not allowed by CORS") {
    statusCode = 403;
    message = "Origin is not allowed by CORS";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Request validation failed";
    details = Object.values(error.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier or value";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "A record with these details already exists";
  } else if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed JSON request body";
  } else if (!(error instanceof ApiError) && statusCode >= 500) {
    message = "Internal server error";
  }

  if (statusCode >= 500) console.error("API error:", error);
  const payload = { success: false, message };
  if (details) payload.errors = details;
  if (process.env.NODE_ENV !== "production" && error instanceof ApiError && error.details) {
    payload.details = error.details;
  }
  res.status(statusCode).json(payload);
};

module.exports = { notFoundMiddleware, errorMiddleware };
