const { body, param } = require("express-validator");

const createItineraryValidator = [
  body("tripId")
    .notEmpty()
    .withMessage("Trip ID is required")
    .isMongoId()
    .withMessage("Invalid trip ID"),

  body("day")
    .notEmpty()
    .withMessage("Day is required")
    .isInt({ min: 1 })
    .withMessage("Day must be a positive integer"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date"),

  body("activities")
    .isArray()
    .withMessage("Activities must be an array"),

  body("activities.*.title")
    .notEmpty()
    .withMessage("Activity title is required")
    .isString()
    .withMessage("Activity title must be a string")
    .isLength({ max: 150 })
    .withMessage("Activity title cannot exceed 150 characters"),

  body("activities.*.description")
    .optional()
    .isString()
    .withMessage("Activity description must be a string")
    .isLength({ max: 500 })
    .withMessage("Activity description cannot exceed 500 characters"),

  body("activities.*.location")
    .optional()
    .isString()
    .withMessage("Activity location must be a string")
    .isLength({ max: 200 })
    .withMessage("Activity location cannot exceed 200 characters"),

  body("activities.*.duration")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Activity duration must be non-negative"),

  body("activities.*.estimatedCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated cost must be non-negative"),
];

const itineraryIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid itinerary ID"),
];

const tripItineraryValidator = [
  param("tripId")
    .isMongoId()
    .withMessage("Invalid trip ID"),
];

const dayItineraryValidator = [
  param("tripId")
    .isMongoId()
    .withMessage("Invalid trip ID"),

  param("day")
    .isInt({ min: 1 })
    .withMessage("Day must be a positive integer"),
];

module.exports = {
  createItineraryValidator,
  itineraryIdValidator,
  tripItineraryValidator,
  dayItineraryValidator,
};
