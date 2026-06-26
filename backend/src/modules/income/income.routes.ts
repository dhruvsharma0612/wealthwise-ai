import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { incomeController as ctrl } from "./income.controller";

export const incomeRouter = Router();

incomeRouter.use(authenticate);

// GET    /api/income            — list income (optional ?month=YYYY-MM) with totals
// POST   /api/income            — create an income entry
// GET    /api/income/:incomeId  — get one entry
// PATCH  /api/income/:incomeId  — update an entry
// DELETE /api/income/:incomeId  — delete an entry

incomeRouter.get("/",            ctrl.list.bind(ctrl));
incomeRouter.post("/",           ctrl.create.bind(ctrl));
incomeRouter.get("/:incomeId",   ctrl.get.bind(ctrl));
incomeRouter.patch("/:incomeId", ctrl.update.bind(ctrl));
incomeRouter.delete("/:incomeId",ctrl.remove.bind(ctrl));
