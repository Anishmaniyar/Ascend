import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import AppError from "./utils/AppError.js";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(express.json());
// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// Cookie Parser for handling tokens securely
app.use(cookieParser());
// Gzip compression
app.use(compression());
// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// API v1 routes entry point
app.use("/api", routes);

app.use((req, res, next) => {
  next(new ApiError(404, "API Route Not Found"));
});

app.use(errorHandler);

export default app;
