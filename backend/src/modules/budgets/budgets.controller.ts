import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { budgetsService } from "./budgets.service";
import { setBudgetSchema, listBudgetQuerySchema } from "./budgets.dto";

class BudgetsController {

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month } = listBudgetQuerySchema.parse(req.query);
      const result = await budgetsService.getForMonth(req.user!.id, month);
      res.json(result);
    } catch (err) { next(err); }
  }

  async set(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = setBudgetSchema.parse(req.body);
      const budget = await budgetsService.set(req.user!.id, dto);
      res.status(201).json(budget);
    } catch (err) { next(err); }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await budgetsService.remove(req.user!.id, req.params.budgetId);
      res.json(result);
    } catch (err) { next(err); }
  }
}

export const budgetsController = new BudgetsController();
