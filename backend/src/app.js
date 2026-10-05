const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const tripRoutes = require("./routes/tripRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TripEase API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "TripEase backend is healthy"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);

module.exports = app;
