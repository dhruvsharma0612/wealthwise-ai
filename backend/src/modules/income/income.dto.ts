import { z } from "zod";

// ─── Shared enum (mirrors Prisma IncomeCategory) ───────────────────────────────

const incomeCategory = z.enum([
  "SALARY", "BUSINESS", "FREELANCE", "INVESTMENT",
  "RENTAL", "BONUS", "GIFT", "OTHER",
]);

// ─── Create ─────────────────────────────────────────────────────────────────────

export const createIncomeSchema = z.object({
  amount:      z.number().positive("Amount must be positive"),
  category:    incomeCategory.default("SALARY"),
  source:      z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  date:        z.string().datetime(),
  isRecurring: z.boolean().default(false),
});

export type CreateIncomeDto = z.infer<typeof createIncomeSchema>;

// ─── Update (all optional) ──────────────────────────────────────────────────────

export const updateIncomeSchema = z.object({
  amount:      z.number().positive().optional(),
  category:    incomeCategory.optional(),
  source:      z.string().max(100).nullable().optional(),
  description: z.string().max(500).nullable().optional(),
  date:        z.string().datetime().optional(),
  isRecurring: z.boolean().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: "No fields to update" });

export type UpdateIncomeDto = z.infer<typeof updateIncomeSchema>;

// ─── List query (optional month filter, "YYYY-MM") ──────────────────────────────

export const listIncomeQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "month must be YYYY-MM").optional(),
});

export type ListIncomeQuery = z.infer<typeof listIncomeQuerySchema>;
