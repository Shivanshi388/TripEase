require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const destinations = require("./destinations");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing from backend/.env");
  process.exit(1);
}

const seedDestinations = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    await Destination.deleteMany({});
    await Destination.insertMany(destinations);

    console.log(`Seeded ${destinations.length} destinations successfully`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Destination seed failed:", error.message);
    process.exit(1);
  }
};

seedDestinations();
