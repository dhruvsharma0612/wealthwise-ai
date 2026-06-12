import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { onboardingService } from "./onboarding.service";
import { financialProfileService } from "../financial-profile/financial-profile.service";
import { goalsStepSchema } from "../financial-profile/financial-profile.dto";

export const onboardingRouter = Router();

onboardingRouter.use(authenticate);

// GET /api/onboarding/status
onboardingRouter.get("/status", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const status = await onboardingService.getStatus(req.user!.id);
    res.json(status);
  } catch (err) { next(err); }
});

// POST /api/onboarding/goals
onboardingRouter.post("/goals", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dto    = goalsStepSchema.parse(req.body);
    const result = await onboardingService.saveGoalsStep(req.user!.id, dto);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/onboarding/complete
onboardingRouter.post("/complete", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await financialProfileService.completeOnboarding(req.user!.id);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/onboarding/skip/:step
onboardingRouter.post("/skip/:step", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.skipStep(req.user!.id, req.params.step.toUpperCase());
    res.json(result);
  } catch (err) { next(err); }
});
