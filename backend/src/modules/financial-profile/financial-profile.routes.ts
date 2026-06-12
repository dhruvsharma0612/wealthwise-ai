import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { financialProfileController as ctrl } from "./financial-profile.controller";

export const financialProfileRouter = Router();

financialProfileRouter.use(authenticate);

// GET  /api/profile              — full profile
// GET  /api/profile/health-score — health score
// POST /api/profile/step/personal-info
// POST /api/profile/step/income-expenses
// POST /api/profile/step/risk-profile
// POST /api/profile/step/emergency-loans
// POST /api/profile/onboarding/complete

financialProfileRouter.get("/",            ctrl.getProfile.bind(ctrl));
financialProfileRouter.get("/health-score", ctrl.getHealthScore.bind(ctrl));
financialProfileRouter.post("/step/personal-info",    ctrl.savePersonalInfo.bind(ctrl));
financialProfileRouter.post("/step/income-expenses",  ctrl.saveIncomeExpenses.bind(ctrl));
financialProfileRouter.post("/step/risk-profile",     ctrl.saveRiskProfile.bind(ctrl));
financialProfileRouter.post("/step/emergency-loans",  ctrl.saveEmergencyAndLoans.bind(ctrl));
financialProfileRouter.post("/onboarding/complete",   ctrl.completeOnboarding.bind(ctrl));
