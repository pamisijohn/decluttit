import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Import routes
import authRouter from "./modules/auth/router";
import listingsRouter from "./modules/listings/router";
import requestsRouter from "./modules/requests/router";
import matchingRouter from "./modules/matching/router";
import transactionsRouter from "./modules/transactions/router";
import paymentsRouter from "./modules/payments/router";
import chatRouter from "./modules/chat/router";
import disputesRouter from "./modules/disputes/router";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/listings", listingsRouter);
app.use("/api/v1/requests", requestsRouter);
app.use("/api/v1/matches", matchingRouter);
app.use("/api/v1/transactions", transactionsRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/disputes", disputesRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
