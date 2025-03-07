import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import redis from "redis";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

import accountRoutes from "./routes/accountRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorMiddleware, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/eaglepaydb";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// 🎯 Function to log connection messages
const logSuccess = (service, message) => console.log(`\x1b[32m✔ [${service}] ${message}\x1b[0m`);
const logError = (service, message) => console.error(`\x1b[31m✖ [${service}] ${message}\x1b[0m`);

// 🛢️ Connect to MongoDB (EaglePayDB)
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logSuccess("MongoDB", "Connected to eaglepaydb 🚀"))
  .catch((err) => logError("MongoDB", `Connection failed: ${err.message}`));

// 🟥 Redis Connection
const redisClient = redis.createClient({ port: REDIS_PORT });
redisClient.on("connect", () => logSuccess("Redis", "Connected Successfully 🚀"));
redisClient.on("error", (err) => logError("Redis", `Connection Error: ${err.message}`));

// 🌍 Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📄 Load Swagger API Documentation
const swaggerFile = path.join(__dirname, "swagger.json");
if (fs.existsSync(swaggerFile)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, "utf-8"));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  logSuccess("Swagger", "API Documentation Loaded 📖");
} else {
  logError("Swagger", "Documentation not found! Please generate `swagger.json`.");
}

// 🔗 API Routes
app.use("/api/account", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

// 🌟 Error Handling Middleware (Must be after routes)
app.use(errorMiddleware);

// 🌍 Root Route
app.get("/", (req, res) => {
  res.send("🦅 Welcome to Eagle Pay API");
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log("\n\x1b[34m------------------------------------------------------\x1b[0m");
  console.log(`\x1b[36m🚀 Server is running on http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36m📖 API Docs available at http://localhost:${PORT}/api/docs\x1b[0m`);
  console.log("\x1b[34m------------------------------------------------------\x1b[0m\n");
});

export default app;

