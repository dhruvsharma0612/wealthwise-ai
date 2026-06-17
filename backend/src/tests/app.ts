import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { errorHandler }           from "../middleware/errorHandler";
import { authRouter }             from "../modules/auth/auth.routes";
import { financialProfileRouter } from "../modules/financial-profile/financial-profile.routes";
import { onboardingRouter }       from "../modules/onboarding/onboarding.routes";
import { goalsRouter }            from "../modules/goals/goals.routes";
import { portfolioRouter }        from "../modules/portfolio/portfolio.routes";

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth",       authRouter);
app.use("/api/profile",    financialProfileRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/goals",      goalsRouter);
app.use("/api/portfolio",  portfolioRouter);
app.use(errorHandler);

export default app;
