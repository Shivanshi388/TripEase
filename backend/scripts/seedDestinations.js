require("dotenv").config();
const mongoose = require("mongoose");
const Destination = require("../src/models/Destination");

const destinations = [
  {
    name: "Paris",
    country: "France",
    city: "Paris",
    description: "A famous European destination known for art, culture, food, and landmarks.",
    category: "City",
    averageCost: 1200,
    rating: 4.8,
    imageUrl: "",
  },
  {
    name: "Bali",
    country: "Indonesia",
    city: "Bali",
    description: "A tropical destination known for beaches, temples, nature, and relaxation.",
    category: "Beach",
    averageCost: 900,
    rating: 4.7,
    imageUrl: "",
  },
  {
    name: "Tokyo",
    country: "Japan",
    city: "Tokyo",
    description: "A vibrant city combining modern technology, traditional culture, food, and entertainment.",
    category: "City",
    averageCost: 1400,
    rating: 4.8,
    imageUrl: "",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    city: "Dubai",
    description: "A modern destination known for luxury, shopping, architecture, and desert experiences.",
    category: "Luxury",
    averageCost: 1300,
    rating: 4.6,
    imageUrl: "",
  },
  {
    name: "Manali",
    country: "India",
    city: "Manali",
    description: "A popular mountain destination known for scenic landscapes, adventure, and snow.",
    category: "Mountain",
    averageCost: 500,
    rating: 4.5,
    imageUrl: "",
  },
];

const seedDestinations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Destination.deleteMany({});
    await Destination.insertMany(destinations);

    console.log("Destinations seeded successfully!");
    console.log(`Inserted ${destinations.length} destinations.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding destinations:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDestinations();