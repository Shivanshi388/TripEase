const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Trip = require("../src/models/Trip");

test("trip model accepts valid required trip data", async () => {
  const trip = new Trip({
    userId: new mongoose.Types.ObjectId(), title: "Weekend trip", destination: "Jaipur",
    startDate: "2026-11-01", endDate: "2026-11-03", budget: 5000,
  });
  await assert.doesNotReject(() => trip.validate());
});

test("trip model rejects missing budget and reversed dates", async () => {
  const trip = new Trip({
    userId: new mongoose.Types.ObjectId(), title: "Weekend trip", destination: "Jaipur",
    startDate: "2026-11-03", endDate: "2026-11-01",
  });
  await assert.rejects(() => trip.validate(), (error) => Boolean(error.errors.budget && error.errors.endDate));
});
