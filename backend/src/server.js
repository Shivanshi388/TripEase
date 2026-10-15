const { validateEnvironment } = require("./config/env");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  validateEnvironment();
  await connectDB();
  const server = app.listen(PORT, () => {
    console.log(`TripEase backend running on http://localhost:${PORT}`);
  });
  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down TripEase API`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((error) => {
  console.error("Unable to start TripEase backend:", error.message);
  process.exit(1);
});
