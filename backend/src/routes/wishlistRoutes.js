const express = require("express");
const { body, param } = require("express-validator");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validateMiddleware = require("../middleware/validateMiddleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.use(authMiddleware);

router.get("/", getWishlist);

router.post(
  "/",
  body("destinationId")
    .notEmpty()
    .withMessage("Destination ID is required")
    .isMongoId()
    .withMessage("Invalid destination ID"),
  validateMiddleware,
  addToWishlist
);

router.delete(
  "/:destinationId",
  param("destinationId")
    .isMongoId()
    .withMessage("Invalid destination ID"),
  validateMiddleware,
  removeFromWishlist
);

module.exports = router;
