// ─── WealthWise AI – JSON Response Schemas (Zod) ─────────────────────────────
// Use these to validate AI responses at runtime before returning to client.

import { z } from 'zod';

// ─── Shared ───────────────────────────────────────────────────────────────────

const urgencySchema = z.enum(['immediate', 'this_month', 'this_quarter', 'long_term']);
const impactSchema = z.enum(['high', 'medium', 'low']);
const goalStatusSchema = z.enum(['on_track', 'at_risk', 'behind', 'completed']);
const gradeSchema = z.enum(['A+', 'A', 'B', 'C', 'D', 'F']);

// ─── Portfolio Analysis ───────────────────────────────────────────────────────

export const RecommendationItemSchema = z.object({
  action: z.string(),
  reason: z.string(),
  urgency: urgencySchema,
  estimatedImpact: z.string(),
});

export const PriorityActionSchema = z.object({
  rank: z.number().int().min(1),
  action: z.string(),
  category: z.enum(['rebalance', 'invest', 'reduce_risk', 'tax', 'diversify']),
  timeline: z.string(),
});

export const PortfolioAnalysisSchema = z.object({
  summary: z.string().min(10),
  strengths: z.array(z.string()).min(1),
  risks: z.array(z.string()).min(1),
  recommendations: z.array(RecommendationItemSchema).min(1),
  priorityActions: z.array(PriorityActionSchema).min(1).max(5),
  assetAllocationComment: z.string(),
  riskAlignmentScore: z.number().min(0).max(100),
});

// ─── Goal Analysis ────────────────────────────────────────────────────────────

export const GoalAnalysisSchema = z.object({
  goalId: z.string(),
  goalName: z.string(),
  goalProgress: z.string(),
  progressPercent: z.number().min(0).max(100),
  status: goalStatusSchema,
  estimatedCompletion: z.string(),
  monthlyRequirement: z.number().nonnegative(),
  currentMonthlySIP: z.number().nonnegative(),
  shortfall: z.number().nonnegative(),
  recommendations: z.array(z.string()).min(1),
  accelerationTips: z.array(z.string()),
});

// ─── Financial Health Score ───────────────────────────────────────────────────

const ScoreComponentSchema = z.object({
  score: z.number().nonnegative(),
  maxScore: z.number().positive(),
  label: z.string(),
});

export const FinancialHealthScoreSchema = z.object({
  score: z.number().min(0).max(100),
  grade: gradeSchema,
  breakdown: z.object({
    savingsRate: ScoreComponentSchema,
    emergencyFund: ScoreComponentSchema,
    debtBurden: ScoreComponentSchema,
    goalProgress: ScoreComponentSchema,
    diversification: ScoreComponentSchema,
    investmentConsistency: ScoreComponentSchema,
    netWorthGrowth: ScoreComponentSchema,
    insuranceCoverage: ScoreComponentSchema,
  }),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  nextActions: z.array(
    z.object({
      priority: z.number().int().min(1),
      action: z.string(),
      impact: impactSchema,
      timeframe: z.string(),
    }),
  ),
  comparisonInsight: z.string(),
});

// ─── Monthly Review ───────────────────────────────────────────────────────────

export const MonthlyReviewSchema = z.object({
  month: z.string(),
  summary: z.string().min(20),
  financialSnapshot: z.object({
    income: z.number().positive(),
    expenses: z.number().nonnegative(),
    savings: z.number(),
    savingsRate: z.number().min(0).max(100),
  }),
  wins: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendations: z.array(z.string()).min(1),
  nextMonthFocus: z.array(z.string()).length(3),
  motivationalInsight: z.string(),
});

// ─── Budget Advice ────────────────────────────────────────────────────────────

export const BudgetAdviceSchema = z.object({
  currentBudgetHealth: z.string(),
  categoryAnalysis: z.array(
    z.object({
      category: z.string(),
      currentSpend: z.number().nonnegative(),
      recommendedSpend: z.number().nonnegative(),
      verdict: z.enum(['healthy', 'slightly_high', 'excessive']),
      tip: z.string(),
    }),
  ),
  leaksDetected: z.array(
    z.object({
      description: z.string(),
      estimatedMonthlyWaste: z.number().positive(),
      fix: z.string(),
    }),
  ),
  optimizationPlan: z.array(z.string()).min(1),
  projectedSavingsIfOptimized: z.number().nonnegative(),
});

// ─── Debt Reduction ───────────────────────────────────────────────────────────

export const DebtReductionSchema = z.object({
  totalDebt: z.number().nonnegative(),
  totalMonthlyEmi: z.number().nonnegative(),
  debtFreeDate: z.string(),
  strategy: z.enum(['avalanche', 'snowball', 'hybrid']),
  strategyReason: z.string(),
  payoffPlan: z.array(
    z.object({
      loanType: z.string(),
      currentBalance: z.number().nonnegative(),
      monthlyPayment: z.number().positive(),
      payoffMonth: z.number().int().positive(),
      totalInterestPaid: z.number().nonnegative(),
    }),
  ),
  interestSavings: z.number().nonnegative(),
  recommendations: z.array(z.string()).min(1),
});

// ─── Retirement Plan ──────────────────────────────────────────────────────────

export const RetirementPlanSchema = z.object({
  currentAge: z.number().int().positive(),
  targetRetirementAge: z.number().int().positive(),
  yearsToRetirement: z.number().int().nonnegative(),
  requiredCorpus: z.number().positive(),
  currentProjectedCorpus: z.number().nonnegative(),
  gap: z.number(),
  monthlyRequiredSIP: z.number().nonnegative(),
  currentMonthlySIP: z.number().nonnegative(),
  recommendation: z.string(),
  assetAllocationSuggestion: z.object({
    equity: z.number().min(0).max(100),
    debt: z.number().min(0).max(100),
    gold: z.number().min(0).max(100),
    nps: z.number().min(0).max(100),
  }),
  milestones: z.array(
    z.object({
      age: z.number().int().positive(),
      targetCorpus: z.number().positive(),
      description: z.string(),
    }),
  ),
});

// ─── Validation Helper ────────────────────────────────────────────────────────

export function validateAIResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context: string,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`AI response validation failed for ${context}: ${errors}`);
  }
  return result.data;
}

// ─── Export all schemas ───────────────────────────────────────────────────────

export const AISchemas = {
  portfolioAnalysis: PortfolioAnalysisSchema,
  goalAnalysis: GoalAnalysisSchema,
  financialHealthScore: FinancialHealthScoreSchema,
  monthlyReview: MonthlyReviewSchema,
  budgetAdvice: BudgetAdviceSchema,
  debtReduction: DebtReductionSchema,
  retirementPlan: RetirementPlanSchema,
} as const;
