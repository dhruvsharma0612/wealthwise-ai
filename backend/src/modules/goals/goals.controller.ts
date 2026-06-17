import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { goalsService } from "./goals.service";
import { createGoalSchema, updateGoalSchema, contributeSchema } from "./goals.dto";

class GoalsController {

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goals = await goalsService.list(req.user!.id);
      res.json({ goals });
    } catch (err) { next(err); }
  }

  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const goal = await goalsService.get(req.user!.id, req.params.goalId);
      res.json(goal);
    } catch (err) { next(err); }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto  = createGoalSchema.parse(req.body);
      const goal = await goalsService.create(req.user!.id, dto);
      res.status(201).json(goal);
    } catch (err) { next(err); }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto  = updateGoalSchema.parse(req.body);
      const goal = await goalsService.update(req.user!.id, req.params.goalId, dto);
      res.json(goal);
    } catch (err) { next(err); }
  }

  async contribute(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto  = contributeSchema.parse(req.body);
      const goal = await goalsService.contribute(req.user!.id, req.params.goalId, dto.amount);
      res.json(goal);
    } catch (err) { next(err); }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await goalsService.remove(req.user!.id, req.params.goalId);
      res.json(result);
    } catch (err) { next(err); }
  }
}

export const goalsController = new GoalsController();
