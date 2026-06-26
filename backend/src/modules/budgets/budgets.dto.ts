import { z } from "zod";
import { expenseCategory } from "../expenses/expenses.dto";

const monthString = z.string().regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM");

// ─── Set a budget limit (upsert one category for a month) ───────────────────────

export const setBudgetSchema = z.object({
  month:    monthString,
  category: expenseCategory,
  amount:   z.number().positive("Budget amount must be positive"),
});

export type SetBudgetDto = z.infer<typeof setBudgetSchema>;

// ─── List query (optional month; defaults to current month) ─────────────────────

export const listBudgetQuerySchema = z.object({
  month: monthString.optional(),
});

export type ListBudgetQuery = z.infer<typeof listBudgetQuerySchema>;
