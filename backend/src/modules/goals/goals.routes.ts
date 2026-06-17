import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { goalsController as ctrl } from "./goals.controller";

export const goalsRouter = Router();

goalsRouter.use(authenticate);

// GET    /api/goals                    — list all goals (with progress metrics)
// POST   /api/goals                    — create a goal
// GET    /api/goals/:goalId            — get one goal
// PATCH  /api/goals/:goalId            — update a goal
// POST   /api/goals/:goalId/contribute — add to currentAmount (track progress)
// DELETE /api/goals/:goalId            — delete a goal

goalsRouter.get("/",                    ctrl.list.bind(ctrl));
goalsRouter.post("/",                   ctrl.create.bind(ctrl));
goalsRouter.get("/:goalId",             ctrl.get.bind(ctrl));
goalsRouter.patch("/:goalId",           ctrl.update.bind(ctrl));
goalsRouter.post("/:goalId/contribute", ctrl.contribute.bind(ctrl));
goalsRouter.delete("/:goalId",          ctrl.remove.bind(ctrl));
