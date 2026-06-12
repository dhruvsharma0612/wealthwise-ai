import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { monthlyReviewService } from "./monthly-review.service";

export const monthlyReviewRouter = Router();

monthlyReviewRouter.use(authenticate);

const generateReviewSchema = z.object({
  month:          z.string().regex(/^\d{4}-\d{2}$/, "Month must be YYYY-MM format"),
  incomeReceived: z.number().positive(),
  totalSpent:     z.number().nonnegative(),
  totalInvested:  z.number().nonnegative().default(0),
  expenseBreakdown: z.record(z.string(), z.number().nonnegative()).optional(),
});

// POST /api/reviews/generate
monthlyReviewRouter.post("/generate", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dto    = generateReviewSchema.parse(req.body);
    const result = await monthlyReviewService.generate(req.user!.id, dto);
    res.json(result);
  } catch (err) { next(err); }
});

// GET  /api/reviews              — history
monthlyReviewRouter.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const limit   = Number(req.query.limit) || 6;
    const history = await monthlyReviewService.getHistory(req.user!.id, limit);
    res.json(history);
  } catch (err) { next(err); }
});

// GET  /api/reviews/:month       — specific month (e.g. 2026-06)
monthlyReviewRouter.get("/:month", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await monthlyReviewService.getReview(req.user!.id, req.params.month);
    res.json(review);
  } catch (err) { next(err); }
});
