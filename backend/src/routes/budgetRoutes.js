const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getBudget,
  createExpense,
} = require("../controllers/budgetController");

const router = express.Router();

router.use(authMiddleware);

router.get("/:tripId", getBudget);

router.post("/:tripId/expenses", createExpense);

module.exports = router;