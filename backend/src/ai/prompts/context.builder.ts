// ─── WealthWise AI – Context Injection Builder ───────────────────────────────

import type {
  UserProfile,
  Portfolio,
  FinancialGoal,
  FinancialMetrics,
  MonthlyReviewInput,
  AIContextBundle,
} from '../interfaces';

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatINR(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function yearsUntil(isoDate: string): number {
  const target = new Date(isoDate);
  const now = new Date();
  return Math.max(0, Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365)));
}

function goalProgressPercent(goal: FinancialGoal): number {
  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
}

// ─── 1. User Profile Context ──────────────────────────────────────────────────

export function buildUserProfileContext(user: UserProfile): string {
  const totalEmi = user.loans.reduce((sum, l) => sum + l.monthlyEmi, 0);
  const emiRatio = ((totalEmi / user.monthlyIncome) * 100).toFixed(1);
  const totalInsuranceCover = user.insurancePolicies
    .filter((p) => p.type === 'life' || p.type === 'term')
    .reduce((sum, p) => sum + p.coverAmount, 0);
  const hasHealthInsurance = user.insurancePolicies.some((p) => p.type === 'health');

  return `
## User Profile
- **Name:** ${user.name}
- **Age:** ${user.age} years | **Country:** ${user.country} | **Currency:** ${user.currency}
- **Occupation:** ${user.occupation}
- **Marital Status:** ${user.maritalStatus} | **Dependents:** ${user.dependents}
- **Risk Profile:** ${user.riskProfile} | **Investment Experience:** ${user.investmentExperience}
- **Subscription:** ${user.subscriptionPlan}

## Income & Expenses
- **Monthly Income:** ${formatINR(user.monthlyIncome)}
- **Monthly Expenses:** ${formatINR(user.monthlyExpenses)}
- **Current Savings Rate:** ${user.savingsRate}%
- **Emergency Fund:** ${user.emergencyFundMonths} months of expenses covered

## Debt Obligations
${
  user.loans.length === 0
    ? '- No active loans'
    : user.loans
        .map(
          (l) =>
            `- ${l.type.toUpperCase()} Loan: Outstanding ${formatINR(l.outstandingAmount)}, EMI ${formatINR(l.monthlyEmi)}/mo @ ${l.interestRate}% for ${l.remainingMonths} months`,
        )
        .join('\n')
}
- **Total Monthly EMI:** ${formatINR(totalEmi)} (${emiRatio}% of income)

## Insurance
- **Life/Term Cover:** ${totalInsuranceCover > 0 ? formatINR(totalInsuranceCover) : '⚠️ NONE — CRITICAL GAP'}
- **Health Insurance:** ${hasHealthInsurance ? '✅ Active' : '⚠️ NONE — HIGH RISK'}
`.trim();
}

// ─── 2. Portfolio Context ─────────────────────────────────────────────────────

export function buildPortfolioContext(portfolio: Portfolio): string {
  const allocationLines = Object.entries(portfolio.assetAllocation)
    .filter(([, pct]) => pct > 0)
    .map(([cls, pct]) => `  - ${cls}: ${pct.toFixed(1)}%`)
    .join('\n');

  const holdingLines = portfolio.holdings
    .map(
      (h) =>
        `  - ${h.name} (${h.assetClass}): ${formatINR(h.currentValue)} | ${h.gainLossPercent >= 0 ? '+' : ''}${h.gainLossPercent.toFixed(1)}% | ${h.allocationPercent.toFixed(1)}% of portfolio`,
    )
    .join('\n');

  return `
## Portfolio Overview
- **Total Value:** ${formatINR(portfolio.totalValue)}
- **Total Invested:** ${formatINR(portfolio.totalInvested)}
- **Overall Gain/Loss:** ${formatINR(portfolio.overallGainLoss)} (${portfolio.overallGainLossPercent >= 0 ? '+' : ''}${portfolio.overallGainLossPercent.toFixed(1)}%)
- **Last Updated:** ${portfolio.lastUpdated}

## Asset Allocation
${allocationLines}

## Holdings
${holdingLines || '  - No holdings recorded'}
`.trim();
}

// ─── 3. Goals Context ─────────────────────────────────────────────────────────

export function buildGoalsContext(goals: FinancialGoal[]): string {
  if (goals.length === 0) return '## Goals\n- No goals set yet.';

  const goalLines = goals
    .map((g) => {
      const pct = goalProgressPercent(g);
      const years = yearsUntil(g.targetDate);
      const shortfall = g.targetAmount - g.currentAmount;
      const statusIcon =
        pct >= 90 ? '🟢' : pct >= 60 ? '🟡' : pct >= 30 ? '🟠' : '🔴';

      return `
### ${statusIcon} ${g.name} (${g.category} | ${g.priority} priority)
- **Target:** ${formatINR(g.targetAmount)} by ${g.targetDate} (${years} years away)
- **Current:** ${formatINR(g.currentAmount)} — **${pct}% complete**
- **Shortfall:** ${formatINR(shortfall)}
- **Required Monthly SIP:** ${g.monthlySIPRequired ? formatINR(g.monthlySIPRequired) : 'Not calculated'}`;
    })
    .join('\n');

  return `## Financial Goals\n${goalLines}`.trim();
}

// ─── 4. Financial Health Context ─────────────────────────────────────────────

export function buildFinancialHealthContext(metrics: FinancialMetrics): string {
  return `
## Financial Health Metrics
- **Net Worth:** ${formatINR(metrics.netWorth)}
- **Total Assets:** ${formatINR(metrics.totalAssets)}
- **Total Liabilities:** ${formatINR(metrics.totalLiabilities)}
- **Debt-to-Income Ratio:** ${(metrics.debtToIncomeRatio * 100).toFixed(1)}% ${metrics.debtToIncomeRatio > 0.4 ? '⚠️ HIGH' : '✅'}
- **Savings Ratio:** ${(metrics.savingsRatio * 100).toFixed(1)}% ${metrics.savingsRatio < 0.2 ? '⚠️ LOW' : '✅'}
- **Investment Ratio:** ${(metrics.investmentRatio * 100).toFixed(1)}%
- **Emergency Fund:** ${metrics.emergencyFundAdequacy.toFixed(1)} months ${metrics.emergencyFundAdequacy < 6 ? '⚠️ BELOW RECOMMENDED 6 MONTHS' : '✅'}
- **Financial Health Score:** ${metrics.financialHealthScore}/100 (Grade: ${metrics.healthGrade})
`.trim();
}

// ─── 5. Monthly Review Context ────────────────────────────────────────────────

export function buildMonthlyReviewContext(review: MonthlyReviewInput): string {
  const savingsRate = ((review.totalSaved / review.incomeReceived) * 100).toFixed(1);

  const categoryLines = review.topExpenseCategories
    .map(
      (c) =>
        `  - ${c.category}: ${formatINR(c.amount)} (${c.percentOfIncome.toFixed(1)}% of income, ${c.vsLastMonth >= 0 ? '+' : ''}${c.vsLastMonth.toFixed(1)}% vs last month)`,
    )
    .join('\n');

  const goalLines = review.newGoalProgress
    ? review.newGoalProgress
        .map(
          (g) =>
            `  - ${g.goalName}: Added ${formatINR(g.addedThisMonth)}, Total ${formatINR(g.currentTotal)}/${formatINR(g.targetAmount)} (${Math.round((g.currentTotal / g.targetAmount) * 100)}%)`,
        )
        .join('\n')
    : '  - No goal updates this month';

  return `
## Monthly Review — ${review.month}
- **Income:** ${formatINR(review.incomeReceived)}
- **Total Spent:** ${formatINR(review.totalSpent)}
- **Total Saved:** ${formatINR(review.totalSaved)} (${savingsRate}% savings rate)
- **Total Invested:** ${formatINR(review.totalInvested)}

## Top Expense Categories
${categoryLines}

## Goal Progress This Month
${goalLines}

${review.unusualEvents?.length ? `## Unusual Events\n${review.unusualEvents.map((e) => `  - ${e}`).join('\n')}` : ''}
`.trim();
}

// ─── Master Context Assembler ─────────────────────────────────────────────────

export function buildFullAIContext(bundle: AIContextBundle): string {
  const sections: string[] = [
    buildUserProfileContext(bundle.user),
    buildFinancialHealthContext(bundle.metrics),
    buildPortfolioContext(bundle.portfolio),
    buildGoalsContext(bundle.goals),
  ];

  if (bundle.userMemorySummary) {
    sections.push(`## Long-Term Memory (Previous Sessions)\n${bundle.userMemorySummary}`);
  }

  return sections.join('\n\n---\n\n');
}
