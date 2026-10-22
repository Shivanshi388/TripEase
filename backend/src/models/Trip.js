const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  destination: { type: String, required: true, trim: true, maxlength: 150 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, min: 0, required: true },
  travelers: { type: Number, default: 1, min: 1 },
  itinerary: [{ day: Number, activities: [String] }],
  status: { type: String, enum: ["planned", "ongoing", "completed", "cancelled"], default: "planned" },
}, { timestamps: true });

tripSchema.pre("validate", function validateTripDates() {
  if (this.startDate && this.endDate && this.startDate > this.endDate) this.invalidate("endDate", "End date must be on or after start date");
});
module.exports = mongoose.model("Trip", tripSchema);
