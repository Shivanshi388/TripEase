const mongoose = require("mongoose");

// Standalone activity model for future activity-level endpoints. Current itinerary
// APIs continue to use their existing embedded activities to avoid a data migration.
const activitySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
  itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary", index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 500, default: "" },
  location: { type: String, trim: true, maxlength: 200, default: "" },
  duration: { type: Number, min: 0, max: 1440, default: 0 },
  estimatedCost: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ["planned", "completed", "cancelled"], default: "planned" },
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
