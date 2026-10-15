const { body, param } = require("express-validator");
const createItineraryValidator = [
  body("tripId").isMongoId().withMessage("Invalid trip ID"),
  body("day").isInt({ min: 1, max: 366 }).withMessage("Day must be between 1 and 366").toInt(),
  body("date").isISO8601().withMessage("Invalid date"),
  body("activities").isArray({ max: 100 }).withMessage("Activities must be an array of at most 100 items"),
  body("activities.*.title").isString().withMessage("Activity title is required").bail().trim().isLength({ min: 1, max: 150 }).withMessage("Activity title must be 1–150 characters"),
  body("activities.*.description").optional().isString().withMessage("Activity description must be a string").bail().isLength({ max: 500 }).withMessage("Activity description cannot exceed 500 characters"),
  body("activities.*.location").optional().isString().withMessage("Activity location must be a string").bail().isLength({ max: 200 }).withMessage("Activity location cannot exceed 200 characters"),
  body("activities.*.duration").optional().isFloat({ min: 0, max: 1440 }).withMessage("Duration must be between 0 and 1440 minutes").toFloat(),
  body("activities.*.estimatedCost").optional().isFloat({ min: 0 }).withMessage("Estimated cost must be non-negative").toFloat(),
];
const itineraryIdValidator = [param("id").isMongoId().withMessage("Invalid itinerary ID")];
const tripItineraryValidator = [param("tripId").isMongoId().withMessage("Invalid trip ID")];
const dayItineraryValidator = [...tripItineraryValidator, param("day").isInt({ min: 1, max: 366 }).withMessage("Day must be between 1 and 366").toInt()];
const updateItineraryValidator = [
  ...itineraryIdValidator,
  body("day").optional().isInt({ min: 1, max: 366 }).withMessage("Day must be between 1 and 366").toInt(),
  body("date").optional().isISO8601().withMessage("Invalid date"),
  body("activities").optional().isArray({ max: 100 }).withMessage("Activities must be an array of at most 100 items"),
  body("activities.*.title").optional().isString().withMessage("Activity title must be a string").bail().trim().isLength({ min: 1, max: 150 }).withMessage("Activity title must be 1–150 characters"),
  body().custom((_, { req }) => ["day", "date", "activities"].some((field) => req.body?.[field] !== undefined)).withMessage("Provide day, date, or activities to update"),
];
module.exports = { createItineraryValidator, itineraryIdValidator, tripItineraryValidator, dayItineraryValidator, updateItineraryValidator };
