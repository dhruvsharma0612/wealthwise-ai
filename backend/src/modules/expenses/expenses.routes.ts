import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { expensesController as ctrl } from "./expenses.controller";

export const expensesRouter = Router();

expensesRouter.use(authenticate);

// GET    /api/expenses             — list expenses (optional ?month=YYYY-MM) with totals
// POST   /api/expenses             — create an expense entry
// GET    /api/expenses/:expenseId  — get one entry
// PATCH  /api/expenses/:expenseId  — update an entry
// DELETE /api/expenses/:expenseId  — delete an entry

expensesRouter.get("/",             ctrl.list.bind(ctrl));
expensesRouter.post("/",            ctrl.create.bind(ctrl));
expensesRouter.get("/:expenseId",   ctrl.get.bind(ctrl));
expensesRouter.patch("/:expenseId", ctrl.update.bind(ctrl));
expensesRouter.delete("/:expenseId",ctrl.remove.bind(ctrl));
