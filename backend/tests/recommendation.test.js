const test = require("node:test");
const assert = require("node:assert/strict");
const { buildFallbackRecommendations } = require("../src/services/mlService");

test("recommendation fallback returns useful suggestions when ML is unavailable", () => {
  const result = buildFallbackRecommendations({ destination: "Jaipur", budget: 12000, days: 3, interests: ["history"] });
  assert.equal(result.type, "fallback");
  assert.equal(result.destination, "Jaipur");
  assert.equal(result.days, 3);
  assert.equal(result.budget, 12000);
  assert.equal(result.suggestions.length, 3);
  assert.match(result.suggestions[0].title, /Jaipur/);
});

test("recommendation fallback safely handles missing optional values", () => {
  const result = buildFallbackRecommendations({ destination: "Goa" });
  assert.equal(result.days, 1);
  assert.equal(result.budget, 0);
  assert.deepEqual(result.interests, []);
});
