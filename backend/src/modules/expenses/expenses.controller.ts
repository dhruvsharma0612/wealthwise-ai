import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { expensesService } from "./expenses.service";
import { createExpenseSchema, updateExpenseSchema, listExpenseQuerySchema } from "./expenses.dto";

class ExpensesController {

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { month } = listExpenseQuerySchema.parse(req.query);
      const result = await expensesService.list(req.user!.id, month);
      res.json(result);
    } catch (err) { next(err); }
  }

  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const expense = await expensesService.get(req.user!.id, req.params.expenseId);
      res.json(expense);
    } catch (err) { next(err); }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto     = createExpenseSchema.parse(req.body);
      const expense = await expensesService.create(req.user!.id, dto);
      res.status(201).json(expense);
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto     = updateExpenseSchema.parse(req.body);
      const expense = await expensesService.update(req.user!.id, req.params.expenseId, dto);
      res.json(expense);
    } catch (err) { next(err); }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await expensesService.remove(req.user!.id, req.params.expenseId);
      res.json(result);
    } catch (err) { next(err); }
  }
}

export const expensesController = new ExpensesController();
