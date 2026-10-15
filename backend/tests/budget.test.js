const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateBudgetSummary, getBudgetAlerts } = require("../src/services/budgetService");

test("budget summary totals expenses and category spending", () => {
  const result = calculateBudgetSummary(1000, [
    { amount: 120, category: "food" },
    { amount: 180, category: "food" },
    { amount: 250, category: "transportation" },
  ]);
  assert.equal(result.totalSpent, 550);
  assert.equal(result.remaining, 450);
  assert.equal(result.percentageUsed, 55);
  assert.equal(result.expenseCount, 3);
  assert.deepEqual(result.categoryTotals, { food: 300, transportation: 250 });
});

test("budget summary handles a zero budget without division errors", () => {
  const result = calculateBudgetSummary(0, [{ amount: 20, category: "food" }]);
  assert.equal(result.percentageUsed, 0);
  assert.equal(result.remaining, -20);
});
