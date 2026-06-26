import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { incomeService } from "./income.service";
import { createIncomeSchema, updateIncomeSchema, listIncomeQuerySchema } from "./income.dto";

class IncomeController {

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month } = listIncomeQuerySchema.parse(req.query);
      const result = await incomeService.list(req.user!.id, month);
      res.json(result);
    } catch (err) { next(err); }
  }

  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const income = await incomeService.get(req.user!.id, req.params.incomeId);
      res.json(income);
    } catch (err) { next(err); }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = createIncomeSchema.parse(req.body);
      const income = await incomeService.create(req.user!.id, dto);
      res.status(201).json(income);
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto    = updateIncomeSchema.parse(req.body);
      const income = await incomeService.update(req.user!.id, req.params.incomeId, dto);
      res.json(income);
    } catch (err) { next(err); }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await incomeService.remove(req.user!.id, req.params.incomeId);
      res.json(result);
    } catch (err) { next(err); }
  }
}

export const incomeController = new IncomeController();
