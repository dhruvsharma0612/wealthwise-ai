// ─── WealthWise AI – Core Interfaces ────────────────────────────────────────

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';
export type SubscriptionPlan = 'free' | 'pro' | 'premium' | 'elite';
export type InvestmentExperience = 'beginner' | 'intermediate' | 'advanced';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type GoalStatus = 'on_track' | 'at_risk' | 'behind' | 'completed';
export type AssetClass =
  | 'stocks'
  | 'etf'
  | 'mutual_fund'
  | 'fixed_deposit'
  | 'gold'
  | 'ppf'
  | 'nps'
  | 'crypto'
  | 'real_estate'
  | 'cash'
  | 'bonds';

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  country: string;           // ISO-3166 alpha-2, e.g. "IN"
  currency: string;          // ISO-4217, e.g. "INR"
  occupation: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;       // percentage 0-100
  emergencyFundMonths: number;
  maritalStatus: MaritalStatus;
  dependents: number;
  riskProfile: RiskProfile;
  investmentExperience: InvestmentExperience;
  subscriptionPlan: SubscriptionPlan;
  loans: Loan[];
  insurancePolicies: InsurancePolicy[];
}

export interface Loan {
  type: 'home' | 'car' | 'personal' | 'education' | 'credit_card' | 'other';
  outstandingAmount: number;
  monthlyEmi: number;
  interestRate: number;
  remainingMonths: number;
}

export interface InsurancePolicy {
  type: 'life' | 'health' | 'term' | 'vehicle' | 'other';
  coverAmount: number;
  annualPremium: number;
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;        // ISO-8601 date
  monthlySIPRequired?: number;
  priority: 'high' | 'medium' | 'low';
  category:
    | 'retirement'
    | 'home'
    | 'education'
    | 'travel'
    | 'emergency_fund'
    | 'vehicle'
    | 'wedding'
    | 'other';
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface PortfolioHolding {
  name: string;
  assetClass: AssetClass;
  currentValue: number;
  investedAmount: number;
  gainLoss: number;
  gainLossPercent: number;
  allocationPercent: number;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  overallGainLoss: number;
  overallGainLossPercent: number;
  holdings: PortfolioHolding[];
  assetAllocation: Record<AssetClass, number>; // percentage per class
  lastUpdated: string;
}

// ─── Financial Metrics ────────────────────────────────────────────────────────

export interface FinancialMetrics {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  debtToIncomeRatio: number;      // monthly EMI / monthly income
  savingsRatio: number;           // savings / income
  investmentRatio: number;        // invested assets / net worth
  emergencyFundAdequacy: number;  // months of expenses covered
  financialHealthScore: number;   // 0-100
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

// ─── Monthly Review Input ─────────────────────────────────────────────────────

export interface MonthlyReviewInput {
  month: string;               // "June 2026"
  incomeReceived: number;
  totalSpent: number;
  totalSaved: number;
  totalInvested: number;
  topExpenseCategories: ExpenseCategory[];
  newGoalProgress?: GoalProgressUpdate[];
  unusualEvents?: string[];    // e.g. "received bonus", "medical emergency"
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentOfIncome: number;
  vsLastMonth: number;         // delta percentage
}

export interface GoalProgressUpdate {
  goalId: string;
  goalName: string;
  addedThisMonth: number;
  currentTotal: number;
  targetAmount: number;
}

// ─── AI Context Bundle ────────────────────────────────────────────────────────

export interface AIContextBundle {
  user: UserProfile;
  portfolio: Portfolio;
  goals: FinancialGoal[];
  metrics: FinancialMetrics;
  conversationHistory?: ConversationMessage[];
  sessionMemory?: SessionMemory;
  userMemorySummary?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SessionMemory {
  topicsDiscussed: string[];
  questionsAsked: string[];
  recommendationsMade: string[];
  userSentiment: 'positive' | 'neutral' | 'anxious' | 'confused';
}

// ─── AI Response Types ────────────────────────────────────────────────────────

export interface PortfolioAnalysisResponse {
  summary: string;
  strengths: string[];
  risks: string[];
  recommendations: RecommendationItem[];
  priorityActions: PriorityAction[];
  assetAllocationComment: string;
  riskAlignmentScore: number;   // 0-100, how well portfolio matches risk profile
}

export interface RecommendationItem {
  action: string;
  reason: string;
  urgency: 'immediate' | 'this_month' | 'this_quarter' | 'long_term';
  estimatedImpact: string;
}

export interface PriorityAction {
  rank: number;
  action: string;
  category: 'rebalance' | 'invest' | 'reduce_risk' | 'tax' | 'diversify';
  timeline: string;
}

export interface GoalAnalysisResponse {
  goalId: string;
  goalName: string;
  goalProgress: string;          // human-readable e.g. "42% complete"
  progressPercent: number;
  status: GoalStatus;
  estimatedCompletion: string;   // e.g. "March 2028 (3 months ahead of schedule)"
  monthlyRequirement: number;
  currentMonthlySIP: number;
  shortfall: number;
  recommendations: string[];
  accelerationTips: string[];
}

export interface FinancialHealthScoreResponse {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: HealthScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  nextActions: NextAction[];
  comparisonInsight: string;     // e.g. "Better than 73% of users your age"
}

export interface HealthScoreBreakdown {
  savingsRate: ScoreComponent;
  emergencyFund: ScoreComponent;
  debtBurden: ScoreComponent;
  goalProgress: ScoreComponent;
  diversification: ScoreComponent;
  investmentConsistency: ScoreComponent;
  netWorthGrowth: ScoreComponent;
  insuranceCoverage: ScoreComponent;
}

export interface ScoreComponent {
  score: number;     // component score
  maxScore: number;  // max possible
  label: string;     // human-readable assessment
}

export interface NextAction {
  priority: number;
  action: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface MonthlyReviewResponse {
  month: string;
  summary: string;
  financialSnapshot: {
    income: number;
    expenses: number;
    savings: number;
    savingsRate: number;
  };
  wins: string[];
  concerns: string[];
  recommendations: string[];
  nextMonthFocus: string[];
  motivationalInsight: string;
}

export interface BudgetAdviceResponse {
  currentBudgetHealth: string;
  categoryAnalysis: CategoryAdvice[];
  leaksDetected: SpendingLeak[];
  optimizationPlan: string[];
  projectedSavingsIfOptimized: number;
}

export interface CategoryAdvice {
  category: string;
  currentSpend: number;
  recommendedSpend: number;
  verdict: 'healthy' | 'slightly_high' | 'excessive';
  tip: string;
}

export interface SpendingLeak {
  description: string;
  estimatedMonthlyWaste: number;
  fix: string;
}

export interface DebtReductionResponse {
  totalDebt: number;
  totalMonthlyEmi: number;
  debtFreeDate: string;
  strategy: 'avalanche' | 'snowball' | 'hybrid';
  strategyReason: string;
  payoffPlan: DebtPayoffStep[];
  interestSavings: number;
  recommendations: string[];
}

export interface DebtPayoffStep {
  loanType: string;
  currentBalance: number;
  monthlyPayment: number;
  payoffMonth: number;
  totalInterestPaid: number;
}

export interface RetirementPlanResponse {
  currentAge: number;
  targetRetirementAge: number;
  yearsToRetirement: number;
  requiredCorpus: number;
  currentProjectedCorpus: number;
  gap: number;
  monthlyRequiredSIP: number;
  currentMonthlySIP: number;
  recommendation: string;
  assetAllocationSuggestion: Record<string, number>;
  milestones: RetirementMilestone[];
}

export interface RetirementMilestone {
  age: number;
  targetCorpus: number;
  description: string;
}
