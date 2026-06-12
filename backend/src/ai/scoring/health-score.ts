// ─── WealthWise AI – Financial Health Score Engine ────────────────────────────
// Deterministic scoring runs before AI call — provides a baseline the AI can
// enrich with narrative context.

import type {
  UserProfile,
  Portfolio,
  FinancialGoal,
  FinancialMetrics,
  FinancialHealthScoreResponse,
  HealthScoreBreakdown,
  ScoreComponent,
  GoalStatus,
} from '../interfaces';

// ─── Component Scorers ────────────────────────────────────────────────────────

function scoreSavingsRate(rate: number): ScoreComponent {
  let score: number;
  let label: string;

  if (rate >= 30) { score = 20; label = 'Excellent — top tier saver'; }
  else if (rate >= 20) { score = 17; label = 'Very good — above average'; }
  else if (rate >= 15) { score = 13; label = 'Good — meeting minimum target'; }
  else if (rate >= 10) { score = 8; label = 'Fair — below recommended 20%'; }
  else { score = 2; label = 'Critical — very low savings rate'; }

  return { score, maxScore: 20, label };
}

function scoreEmergencyFund(months: number): ScoreComponent {
  let score: number;
  let label: string;

  if (months >= 6) { score = 15; label = 'Fully funded — 6+ months covered'; }
  else if (months >= 5) { score = 13; label = 'Nearly there — build 1 more month'; }
  else if (months >= 3) { score = 10; label = 'Partial — target 6 months'; }
  else if (months >= 1) { score = 5; label = 'Minimal — high financial risk'; }
  else { score = 0; label = 'None — critical vulnerability'; }

  return { score, maxScore: 15, label };
}

function scoreDebtBurden(debtToIncomeRatio: number): ScoreComponent {
  const pct = debtToIncomeRatio * 100;
  let score: number;
  let label: string;

  if (pct < 20) { score = 15; label = 'Excellent — low debt burden'; }
  else if (pct < 30) { score = 12; label = 'Good — manageable debt'; }
  else if (pct < 40) { score = 9; label = 'Moderate — approaching limit'; }
  else if (pct < 50) { score = 5; label = 'High — debt limiting wealth building'; }
  else { score = 0; label = 'Critical — debt overwhelming income'; }

  return { score, maxScore: 15, label };
}

function scoreGoalProgress(goals: FinancialGoal[]): ScoreComponent {
  if (goals.length === 0) {
    return { score: 7, maxScore: 15, label: 'No goals set — define goals to score higher' };
  }

  const goalScores = goals.map((g) => {
    const pct = (g.currentAmount / g.targetAmount) * 100;
    const monthsRemaining = Math.max(
      1,
      (new Date(g.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30),
    );
    const requiredMonthly = (g.targetAmount - g.currentAmount) / monthsRemaining;
    const onTrack = !g.monthlySIPRequired || requiredMonthly <= (g.monthlySIPRequired ?? 0) * 1.1;
    return onTrack ? 15 : pct > 50 ? 10 : 5;
  });

  const avg = goalScores.reduce((s, v) => s + v, 0) / goalScores.length;
  const score = Math.round(avg);
  const onTrackCount = goalScores.filter((s) => s === 15).length;
  const label = `${onTrackCount}/${goals.length} goals on track`;

  return { score, maxScore: 15, label };
}

function scoreDiversification(portfolio: Portfolio): ScoreComponent {
  const activeClasses = Object.values(portfolio.assetAllocation).filter((v) => v > 2).length;
  let score: number;
  let label: string;

  if (activeClasses >= 6) { score = 10; label = 'Well-diversified across 6+ asset classes'; }
  else if (activeClasses >= 4) { score = 8; label = 'Good diversification — 4-5 classes'; }
  else if (activeClasses >= 2) { score = 5; label = 'Moderate — add more asset classes'; }
  else { score = 2; label = 'Concentrated — single asset class risk'; }

  return { score, maxScore: 10, label };
}

function scoreInvestmentConsistency(portfolio: Portfolio, goals: FinancialGoal[]): ScoreComponent {
  const hasActiveSIPs = goals.some((g) => g.monthlySIPRequired && g.monthlySIPRequired > 0);
  const hasInvestments = portfolio.totalValue > 0;

  if (hasActiveSIPs && hasInvestments) {
    return { score: 10, maxScore: 10, label: 'Active SIPs — consistent investor' };
  }
  if (hasInvestments) {
    return { score: 5, maxScore: 10, label: 'Investments present but no regular SIPs' };
  }
  return { score: 0, maxScore: 10, label: 'No active investments' };
}

function scoreNetWorthGrowth(metrics: FinancialMetrics): ScoreComponent {
  // Proxy: use investment ratio as a measure of net worth quality
  const ratio = metrics.investmentRatio;
  let score: number;
  let label: string;

  if (ratio >= 0.6) { score = 10; label = 'Strong — most of net worth is invested'; }
  else if (ratio >= 0.4) { score = 8; label = 'Good — solid investment base'; }
  else if (ratio >= 0.2) { score = 6; label = 'Moderate — room to grow investments'; }
  else if (ratio > 0) { score = 3; label = 'Low — net worth mostly in non-invested assets'; }
  else { score = 0; label = 'No invested net worth'; }

  return { score, maxScore: 10, label };
}

function scoreInsurance(user: UserProfile): ScoreComponent {
  const hasTermOrLife = user.insurancePolicies.some(
    (p) => p.type === 'term' || p.type === 'life',
  );
  const hasHealth = user.insurancePolicies.some((p) => p.type === 'health');

  if (hasTermOrLife && hasHealth) return { score: 5, maxScore: 5, label: 'Fully covered — term + health insurance' };
  if (hasTermOrLife || hasHealth) return { score: 3, maxScore: 5, label: 'Partially covered — missing one type' };
  return { score: 0, maxScore: 5, label: 'No insurance — critical financial risk' };
}

// ─── Grade Calculator ─────────────────────────────────────────────────────────

function calculateGrade(score: number): FinancialHealthScoreResponse['grade'] {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

// ─── Main Scorer ──────────────────────────────────────────────────────────────

export function calculateFinancialHealthScore(
  user: UserProfile,
  portfolio: Portfolio,
  goals: FinancialGoal[],
  metrics: FinancialMetrics,
): Omit<FinancialHealthScoreResponse, 'strengths' | 'weaknesses' | 'nextActions' | 'comparisonInsight'> {
  const breakdown: HealthScoreBreakdown = {
    savingsRate: scoreSavingsRate(user.savingsRate),
    emergencyFund: scoreEmergencyFund(user.emergencyFundMonths),
    debtBurden: scoreDebtBurden(metrics.debtToIncomeRatio),
    goalProgress: scoreGoalProgress(goals),
    diversification: scoreDiversification(portfolio),
    investmentConsistency: scoreInvestmentConsistency(portfolio, goals),
    netWorthGrowth: scoreNetWorthGrowth(metrics),
    insuranceCoverage: scoreInsurance(user),
  };

  const score = Object.values(breakdown).reduce((sum, c) => sum + c.score, 0);
  const grade = calculateGrade(score);

  return { score, grade, breakdown };
}

// ─── Metrics Calculator ───────────────────────────────────────────────────────

export function calculateFinancialMetrics(
  user: UserProfile,
  portfolio: Portfolio,
): FinancialMetrics {
  const totalLiabilities = user.loans.reduce((s, l) => s + l.outstandingAmount, 0);
  const totalAssets = portfolio.totalValue;
  const netWorth = totalAssets - totalLiabilities;
  const totalMonthlyEmi = user.loans.reduce((s, l) => s + l.monthlyEmi, 0);

  const baseScore = calculateFinancialHealthScore(
    user,
    portfolio,
    [],
    {
      netWorth,
      totalAssets,
      totalLiabilities,
      debtToIncomeRatio: totalMonthlyEmi / user.monthlyIncome,
      savingsRatio: user.savingsRate / 100,
      investmentRatio: portfolio.totalValue / Math.max(1, netWorth),
      emergencyFundAdequacy: user.emergencyFundMonths,
      financialHealthScore: 0,
      healthGrade: 'F',
    },
  );

  const healthGrade = baseScore.grade;

  return {
    netWorth,
    totalAssets,
    totalLiabilities,
    debtToIncomeRatio: totalMonthlyEmi / user.monthlyIncome,
    savingsRatio: user.savingsRate / 100,
    investmentRatio: portfolio.totalValue / Math.max(1, netWorth),
    emergencyFundAdequacy: user.emergencyFundMonths,
    financialHealthScore: baseScore.score,
    healthGrade: healthGrade as FinancialMetrics['healthGrade'],
  };
}
