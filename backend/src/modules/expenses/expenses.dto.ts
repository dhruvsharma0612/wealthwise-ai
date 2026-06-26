import { z } from "zod";

// ─── Shared enum (mirrors Prisma ExpenseCategory) ──────────────────────────────

export const expenseCategory = z.enum([
  "HOUSING", "FOOD", "TRANSPORT", "UTILITIES", "HEALTHCARE",
  "ENTERTAINMENT", "SHOPPING", "EDUCATION", "PERSONAL",
  "INSURANCE", "DEBT", "SAVINGS", "OTHER",
]);

// ─── Create ─────────────────────────────────────────────────────────────────────

export const createExpenseSchema = z.object({
  amount:      z.number().positive("Amount must be positive"),
  category:    expenseCategory.default("OTHER"),
  description: z.string().max(500).optional(),
  date:        z.string().datetime(),
  isRecurring: z.boolean().default(false),
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;

// ─── Update (all optional) ──────────────────────────────────────────────────────

export const updateExpenseSchema = z.object({
  amount:      z.number().positive().optional(),
  category:    expenseCategory.optional(),
  description: z.string().max(500).nullable().optional(),
  date:        z.string().datetime().optional(),
  isRecurring: z.boolean().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: "No fields to update" });

export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;

// ─── List query (optional month filter, "YYYY-MM") ──────────────────────────────

export const listExpenseQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM").optional(),
});

export type ListExpenseQuery = z.infer<typeof listExpenseQuerySchema>;
