import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import { authMiddleware } from './middleware/authMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { loggerMiddleware } from './middleware/loggerMiddleware.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { fraudDetectionMiddleware } from './middleware/fraudDetectionMiddleware.js';
import { ipBlocker } from './middleware/ipBlocker.js';

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(loggerMiddleware);
app.use(rateLimiter);
app.use(ipBlocker);
// Mount Routes
app.use("/api", routes);


// Error Handling Middleware
app.use(errorHandler);

export default app;

