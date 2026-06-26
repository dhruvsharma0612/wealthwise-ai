import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { budgetsController as ctrl } from "./budgets.controller";

export const budgetsRouter = Router();

budgetsRouter.use(authenticate);

// GET    /api/budgets            — budgets for a month (?month=YYYY-MM) with spend vs limit
// POST   /api/budgets            — set (upsert) a budget limit for a category/month
// DELETE /api/budgets/:budgetId  — remove a budget limit

budgetsRouter.get("/",            ctrl.list.bind(ctrl));
budgetsRouter.post("/",           ctrl.set.bind(ctrl));
budgetsRouter.delete("/:budgetId",ctrl.remove.bind(ctrl));
