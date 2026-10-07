cat > src/controllers/budgetController.js <<'EOF'
const {
  getBudgetSummary,
  addExpense,
} = require("../services/budgetService");

const getBudget = async (req, res) => {
  try {
    const summary = await getBudgetSummary(
      req.user.id,
      req.params.tripId
    );

    return res.status(200).json(summary);
  } catch (error) {
    console.error("Get budget error:", error.message);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to fetch budget right now.",
    });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = await addExpense(
      req.user.id,
      req.params.tripId,
      req.body
    );

    return res.status(201).json(expense);
  } catch (error) {
    console.error("Create expense error:", error.message);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Unable to create expense right now.",
    });
  }
};

module.exports = {
  getBudget,
  createExpense,
};
EOF