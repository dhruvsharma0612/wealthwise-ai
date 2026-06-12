import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { financialProfileService } from "./financial-profile.service";
import { financialHealthService } from "../financial-health/financial-health.service";
import {
  personalInfoSchema,
  incomeExpensesSchema,
  riskProfileSchema,
  emergencyLoansSchema,
  updateProfileSchema,
} from "./financial-profile.dto";

class FinancialProfileController {

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await financialProfileService.getProfile(req.user!.id);
      res.json(profile);
    } catch (err) { next(err); }
  }

  async getHealthScore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const score = await financialHealthService.calculate(req.user!.id);
      res.json(score);
    } catch (err) { next(err); }
  }

  async savePersonalInfo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = personalInfoSchema.parse(req.body);
      const result = await financialProfileService.savePersonalInfo(req.user!.id, dto);
      res.json(result);
    } catch (err) { next(err); }
  }

  async saveIncomeExpenses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = incomeExpensesSchema.parse(req.body);
      const result = await financialProfileService.saveIncomeExpenses(req.user!.id, dto);
      res.json(result);
    } catch (err) { next(err); }
  }

  async saveRiskProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = riskProfileSchema.parse(req.body);
      const result = await financialProfileService.saveRiskProfile(req.user!.id, dto);
      res.json(result);
    } catch (err) { next(err); }
  }

  async saveEmergencyAndLoans(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = emergencyLoansSchema.parse(req.body);
      const result = await financialProfileService.saveEmergencyAndLoans(req.user!.id, dto);
      res.json(result);
    } catch (err) { next(err); }
  }

  async completeOnboarding(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await financialProfileService.completeOnboarding(req.user!.id);
      res.json(result);
    } catch (err) { next(err); }
  }
}

export const financialProfileController = new FinancialProfileController();
