const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const userRoutes = require("./routes/userRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const tripDetailsRoutes = require("./routes/tripDetailsRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TripEase API!",
    status: "Backend is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/trip-details", tripDetailsRoutes);

module.exports = app;
