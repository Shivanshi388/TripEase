const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const mlRoutes = require("./routes/mlRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const userRoutes = require("./routes/userRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const tripDetailsRoutes = require("./routes/tripDetailsRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { notFoundMiddleware, errorMiddleware } = require("./middleware/errorMiddleware");

const app = express();
app.set('trust proxy', 1);
const configuredOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:4173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

app.disable("x-powered-by");
app.use(cors({
  origin(origin, callback) {
    // Permit server-to-server requests and tools without an Origin header.
    if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.get("/", (req, res) => res.json({
  success: true,
  message: "Welcome to TripEase API!",
  status: "Backend is running",
}));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use('/api/ml', mlRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/trip-details", tripDetailsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;


