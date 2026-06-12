import { z } from "zod";

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  age:          z.number().int().min(18).max(100),
  occupation:   z.string().min(2).max(100),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
  dependents:   z.number().int().min(0).max(20).default(0),
  country:      z.string().length(2).default("IN"),
  currency:     z.string().length(3).default("INR"),
});

export type PersonalInfoDto = z.infer<typeof personalInfoSchema>;

// ─── Step 2: Income & Expenses ────────────────────────────────────────────────

export const incomeExpensesSchema = z.object({
  monthlyIncome:   z.number().positive("Monthly income must be positive"),
  monthlyExpenses: z.number().nonnegative(),
}).refine((d) => d.monthlyExpenses < d.monthlyIncome, {
  message: "Monthly expenses cannot exceed monthly income",
  path: ["monthlyExpenses"],
});

export type IncomeExpensesDto = z.infer<typeof incomeExpensesSchema>;

// ─── Step 3: Risk Profile ─────────────────────────────────────────────────────

export const riskProfileSchema = z.object({
  riskProfile:          z.enum(["CONSERVATIVE", "MODERATE", "AGGRESSIVE"]),
  investmentExperience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  insuranceCoverage:    z.boolean(),
  insuranceDetails: z.object({
    life:   z.boolean().default(false),
    health: z.boolean().default(false),
    term:   z.boolean().default(false),
  }).optional(),
});

export type RiskProfileDto = z.infer<typeof riskProfileSchema>;

// ─── Step 4: Emergency Fund & Loans ──────────────────────────────────────────

export const emergencyLoansSchema = z.object({
  emergencyFundAmount: z.number().nonnegative(),
  loans: z.array(z.object({
    type:             z.enum(["home", "car", "personal", "education", "credit_card", "other"]),
    lenderName:       z.string().optional(),
    outstandingAmount: z.number().positive(),
    monthlyEmi:       z.number().positive(),
    interestRate:     z.number().min(0).max(100),
    remainingMonths:  z.number().int().positive(),
  })).default([]),
});

export type EmergencyLoansDto = z.infer<typeof emergencyLoansSchema>;

// ─── Step 5: Goals ────────────────────────────────────────────────────────────

export const goalSchema = z.object({
  title:        z.string().min(2).max(100),
  category:     z.enum(["RETIREMENT","HOME","EDUCATION","TRAVEL","EMERGENCY_FUND","VEHICLE","WEDDING","INVESTMENT","OTHER"]),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative().default(0),
  targetDate:   z.string().datetime().optional(),
  monthlySIP:   z.number().nonnegative().optional(),
  priority:     z.enum(["high", "medium", "low"]).default("medium"),
});

export const goalsStepSchema = z.object({
  goals: z.array(goalSchema).min(1, "Add at least one goal"),
});

export type GoalDto = z.infer<typeof goalSchema>;
export type GoalsStepDto = z.infer<typeof goalsStepSchema>;

// ─── Full Profile Update ──────────────────────────────────────────────────────

export const updateProfileSchema = personalInfoSchema
  .merge(incomeExpensesSchema)
  .merge(riskProfileSchema)
  .merge(emergencyLoansSchema.omit({ loans: true }))
  .partial();

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
