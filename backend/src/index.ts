import "dotenv/config";
import "./config/env"; // validates env vars on startup

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./services/logger";
import { prisma } from "./services/prisma";
import { redis } from "./services/redis";

// ─── Route Imports ────────────────────────────────────────────────────────────

import { authRouter }             from "./modules/auth/auth.routes";
import { financialProfileRouter } from "./modules/financial-profile/financial-profile.routes";
import { onboardingRouter }       from "./modules/onboarding/onboarding.routes";
import { goalsRouter }            from "./modules/goals/goals.routes";
import { portfolioRouter }        from "./modules/portfolio/portfolio.routes";
import { chatRouter }             from "./modules/chat/chat.routes";
import { monthlyReviewRouter }    from "./modules/monthly-review/monthly-review.routes";
import { marketRouter }           from "./modules/market/market.routes";
import { startMonthlyReviewCron } from "./modules/monthly-review/monthly-review.cron";

// ─── App Setup ────────────────────────────────────────────────────────────────

const app  = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      "http://localhost:3001",
      "http://localhost:3000",
    ].filter(Boolean);
    // Allow Vercel preview URLs and no-origin requests (mobile/curl)
    if (!origin || allowed.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: "10kb" }));

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/auth",       authRouter);
app.use("/api/profile",    financialProfileRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/goals",      goalsRouter);
app.use("/api/portfolio",  portfolioRouter);
app.use("/api/chat",       chatRouter);
app.use("/api/reviews",    monthlyReviewRouter);
app.use("/api/market",     marketRouter);

// ─── Error Handler ────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info("Database connected");

    await redis.connect();

    startMonthlyReviewCron();

    app.listen(PORT, () => {
      logger.info(`WealthWise API running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", { err });
    process.exit(1);
  }
}

bootstrap();

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received — shutting down gracefully");
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

