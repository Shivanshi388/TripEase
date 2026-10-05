
const express = require("express");
const cors = require("cors");
const tripRoutes = require("./routes/tripRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TripEase API!",
    status: "Backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

module.exports = app;