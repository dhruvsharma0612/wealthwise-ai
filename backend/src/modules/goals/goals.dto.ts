import { z } from "zod";

// ─── Shared enums (mirror Prisma GoalCategory / GoalStatus / priority) ─────────

const goalCategory = z.enum([
  "RETIREMENT", "HOME", "EDUCATION", "TRAVEL", "EMERGENCY_FUND",
  "VEHICLE", "WEDDING", "INVESTMENT", "OTHER",
]);

const goalPriority = z.enum(["high", "medium", "low"]);

// ─── Create ────────────────────────────────────────────────────────────────────

export const createGoalSchema = z.object({
  title:        z.string().min(2).max(100),
  description:  z.string().max(500).optional(),
  category:     goalCategory.default("OTHER"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().nonnegative().default(0),
  targetDate:   z.string().datetime().optional(),
  monthlySIP:   z.number().nonnegative().optional(),
  priority:     goalPriority.default("medium"),
});

export type CreateGoalDto = z.infer<typeof createGoalSchema>;

// ─── Update (all fields optional; status editable here) ────────────────────────

export const updateGoalSchema = z.object({
  title:        z.string().min(2).max(100).optional(),
  description:  z.string().max(500).optional(),
  category:     goalCategory.optional(),
  targetAmount: z.number().positive().optional(),
  currentAmount: z.number().nonnegative().optional(),
  targetDate:   z.string().datetime().nullable().optional(),
  monthlySIP:   z.number().nonnegative().nullable().optional(),
  priority:     goalPriority.optional(),
  status:       z.enum(["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"]).optional(),
}).refine((d) => Object.keys(d).length > 0, { message: "No fields to update" });

export type UpdateGoalDto = z.infer<typeof updateGoalSchema>;

// ─── Contribute (track progress) ───────────────────────────────────────────────

export const contributeSchema = z.object({
  amount: z.number().positive("Contribution amount must be positive"),
});

export type ContributeDto = z.infer<typeof contributeSchema>;
