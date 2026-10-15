const { body, param } = require("express-validator");
const tripFields = [
  body("title").optional().isString().withMessage("Trip title must be a string").bail().trim().isLength({ min: 1, max: 150 }).withMessage("Trip title must be 1–150 characters"),
  body("destination").optional().isString().withMessage("Destination must be a string").bail().trim().isLength({ min: 1, max: 150 }).withMessage("Destination must be 1–150 characters"),
  body("startDate").optional().isISO8601().withMessage("Invalid start date"),
  body("endDate").optional().isISO8601().withMessage("Invalid end date"),
  body("budget").optional().isFloat({ min: 0 }).withMessage("Budget must be non-negative").toFloat(),
  body("travelers").optional().isInt({ min: 1, max: 100 }).withMessage("Travelers must be between 1 and 100").toInt(),
];
const createTripValidator = [
  body("title").isString().withMessage("Trip title is required").bail().trim().isLength({ min: 1, max: 150 }).withMessage("Trip title must be 1–150 characters"),
  body("destination").isString().withMessage("Destination is required").bail().trim().isLength({ min: 1, max: 150 }).withMessage("Destination must be 1–150 characters"),
  body("startDate").isISO8601().withMessage("Invalid start date"),
  body("endDate").isISO8601().withMessage("Invalid end date"),
  body("budget").exists().withMessage("Budget is required").bail().isFloat({ min: 0 }).withMessage("Budget must be non-negative").toFloat(),
  body("travelers").optional().isInt({ min: 1, max: 100 }).withMessage("Travelers must be between 1 and 100").toInt(),
  body().custom((_, { req }) => !(req.body.startDate && req.body.endDate) || new Date(req.body.startDate) <= new Date(req.body.endDate)).withMessage("End date must be on or after start date"),
];
const tripIdValidator = [param("id").isMongoId().withMessage("Invalid trip ID")];
const updateTripValidator = [
  ...tripFields,
  body("status").optional().isIn(["planned", "ongoing", "completed", "cancelled"]).withMessage("Invalid trip status"),
  body().custom((_, { req }) => Object.keys(req.body || {}).some((key) => ["title", "destination", "startDate", "endDate", "budget", "travelers", "status"].includes(key))).withMessage("Provide at least one supported field to update"),
  body().custom((_, { req }) => {
    const start = req.body.startDate;
    const end = req.body.endDate;
    return !(start && end) || new Date(start) <= new Date(end);
  }).withMessage("End date must be on or after start date"),
];
module.exports = { createTripValidator, tripIdValidator, updateTripValidator };
