const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");
const { getMe, updateMe } = require("../controllers/userController");

router.use(authMiddleware);

router.get("/me", getMe);

router.put(
  "/me",
  [
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .bail()
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage("Name must be between 2 and 60 characters"),
    body("email")
      .optional()
      .isString()
      .withMessage("Email must be a string")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .bail()
      .isLength({ max: 254 })
      .withMessage("Email must not exceed 254 characters"),
  ],
  validateMiddleware,
  updateMe
);

module.exports = router;
