const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");
const { body } = require("express-validator");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.use(authMiddleware);

router.get("/", getProfile);

router.patch(
  "/",
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  validateMiddleware,
  updateProfile
);

module.exports = router;
