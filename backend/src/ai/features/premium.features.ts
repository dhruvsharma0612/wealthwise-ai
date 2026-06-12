// ─── WealthWise AI – Premium Features Architecture ────────────────────────────

import type { AIContextBundle, UserProfile, FinancialGoal, Portfolio } from '../interfaces';

// ─── Feature Gate Map ─────────────────────────────────────────────────────────

export const FEATURE_PLAN_MAP = {
  free: [
    'financial_health_score',
    'basic_budget_advice',
    'goal_tracking',
    'basic_portfolio_view',
    'monthly_tips',
  ],
  pro: [
    'financial_health_score',
    'detailed_budget_analysis',
    'goal_planner',
    'portfolio_analyzer',
    'debt_advisor',
    'monthly_review',
    'spending_leak_detection',
    'tax_saving_tips',
  ],
  premium: [
    'ai_personal_cfo',
    'retirement_forecasting',
    'goal_acceleration',
    'portfolio_rebalancing_alerts',
    'spending_leak_detection',
    'wealth_growth_roadmap',
    'tax_efficiency_optimizer',
    'goal_planner',
    'debt_advisor',
    'monthly_review',
    'portfolio_analyzer',
    'financial_health_score',
  ],
  elite: [
    'ai_personal_cfo',
    'retirement_forecasting',
    'goal_acceleration',
    'portfolio_rebalancing_alerts',
    'spending_leak_detection',
    'wealth_growth_roadmap',
    'tax_efficiency_optimizer',
    'custom_investment_strategy',
    'family_financial_planning',
    'nri_advisory',
    'real_estate_analysis',
    'private_wealth_strategies',
    'quarterly_human_review',
    'goal_planner',
    'debt_advisor',
    'monthly_review',
    'portfolio_analyzer',
    'financial_health_score',
  ],
} as const;

// ─── 1. AI Personal CFO (Premium+) ───────────────────────────────────────────

export function buildPersonalCFOPrompt(
  bundle: AIContextBundle,
  weeklyContext: string,
): string {
  return `
${weeklyContext}

---

## Your Role: AI Personal CFO — Weekly Check-In

You are ${bundle.user.name}'s dedicated Personal CFO. This is their weekly financial check-in.

As their CFO, proactively surface:
1. **This Week's Financial Pulse** — anything that changed or needs attention
2. **Upcoming Financial Deadlines** — EMI dues, SIP dates, tax deadlines, goal milestones
3. **One Insight They Didn't Ask For** — something in their data they should know about
4. **Weekly Action** — one specific thing to do this week

Think like a CFO who has reviewed all their accounts, not like a chatbot waiting for questions.
Be proactive, specific, and action-driven. Reference their exact numbers.
Limit to 300 words — busy professionals need concise, high-value updates.
`.trim();
}

// ─── 2. Retirement Forecasting Engine (Premium+) ─────────────────────────────

export interface RetirementScenario {
  label: string;
  monthlySIP: number;
  expectedReturnRate: number;
  retirementAge: number;
  projectedCorpus: number;
  monthlyRetirementIncome: number;
  isAchievable: boolean;
}

export function buildRetirementScenariosPrompt(
  bundle: AIContextBundle,
  scenarios: RetirementScenario[],
): string {
  const scenarioText = scenarios
    .map(
      (s, i) => `
Scenario ${i + 1} — ${s.label}:
- Monthly SIP: ₹${s.monthlySIP.toLocaleString('en-IN')}
- Expected Return: ${s.expectedReturnRate}% CAGR
- Retirement Age: ${s.retirementAge}
- Projected Corpus: ₹${s.projectedCorpus.toLocaleString('en-IN')}
- Monthly Retirement Income (SWR 4%): ₹${s.monthlyRetirementIncome.toLocaleString('en-IN')}
- Achievable: ${s.isAchievable ? '✅' : '❌'}`,
    )
    .join('\n');

  return `
## Retirement Scenario Analysis for ${bundle.user.name}

Current Age: ${bundle.user.age} | Current Income: ₹${bundle.user.monthlyIncome.toLocaleString('en-IN')}/mo

${scenarioText}

---

Compare these three retirement scenarios for ${bundle.user.name}. Explain the trade-offs in plain language.
Recommend which scenario is most realistic given their current financial situation.
Highlight what would need to change in their life to achieve each scenario.
Identify the single highest-leverage action to improve their retirement outcome.

Be honest about scenarios that aren't achievable without major changes. Don't sugarcoat.
`.trim();
}

// ─── 3. Goal Acceleration Engine (Premium+) ──────────────────────────────────

export function buildGoalAccelerationPrompt(
  bundle: AIContextBundle,
  goalId: string,
): string {
  const goal = bundle.goals.find((g) => g.id === goalId);
  if (!goal) throw new Error(`Goal ${goalId} not found in bundle`);

  const monthlyIncome = bundle.user.monthlyIncome;
  const currentSurplus = monthlyIncome - bundle.user.monthlyExpenses;

  return `
${bundle.user.name} wants to reach "${goal.name}" (₹${goal.targetAmount.toLocaleString('en-IN')}) faster.

Current Situation:
- Goal Progress: ₹${goal.currentAmount.toLocaleString('en-IN')} / ₹${goal.targetAmount.toLocaleString('en-IN')} (${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%)
- Target Date: ${goal.targetDate}
- Monthly Surplus: ₹${currentSurplus.toLocaleString('en-IN')}

Generate a Goal Acceleration Plan:
1. **Quick Wins** — What can they stop spending on immediately to redirect ₹5,000-₹15,000/month toward this goal?
2. **SIP Optimization** — Which existing SIPs could be paused temporarily without harming long-term wealth?
3. **Lump Sum Opportunities** — Bonus, tax refund, or FD maturity that could be directed here?
4. **Return Optimization** — Are they in the optimal instrument for this goal's timeframe?
5. **Timeline Impact** — If they increase monthly contribution by ₹5k, ₹10k, ₹15k — how many months earlier do they hit the goal?

Be specific. Use numbers. Create urgency without anxiety.
`.trim();
}

// ─── 4. Spending Leak Detector (Pro+) ────────────────────────────────────────

export interface SpendingTransaction {
  date: string;
  category: string;
  merchant: string;
  amount: number;
  isRecurring: boolean;
}

export function buildSpendingLeakPrompt(
  bundle: AIContextBundle,
  transactions: SpendingTransaction[],
  lookbackDays: number = 30,
): string {
  const categoryTotals = transactions.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});

  const recurringTotal = transactions
    .filter((t) => t.isRecurring)
    .reduce((s, t) => s + t.amount, 0);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([cat, amt]) => `  - ${cat}: ₹${amt.toLocaleString('en-IN')}`)
    .join('\n');

  return `
Analyze ${bundle.user.name}'s spending for the last ${lookbackDays} days.

**Monthly Income:** ₹${bundle.user.monthlyIncome.toLocaleString('en-IN')}
**Total Transactions Analyzed:** ${transactions.length}
**Recurring Subscriptions Total:** ₹${recurringTotal.toLocaleString('en-IN')}/mo

**Top Spending Categories:**
${topCategories}

**Identify Spending Leaks:**
1. Subscriptions they likely forgot about or don't use (flag anything with "subscription", "netflix", "prime", "spotify", "gym", "app" pattern)
2. Food delivery excess (Zomato/Swiggy frequency and amounts)
3. Impulse categories with high frequency + low unit value (many small transactions)
4. Lifestyle inflation (spending has grown but income hasn't)
5. Avoidable fees (late payment fees, ATM charges, forex fees)
6. Unused subscriptions that have auto-renewed

Quantify the monthly savings potential for each leak. Suggest specific cancellations or reductions.
Target finding at least ₹3,000-₹8,000/month in savings that won't significantly impact quality of life.
`.trim();
}

// ─── 5. Portfolio Rebalancing Alert Engine (Premium+) ────────────────────────

export function buildRebalancingAlertPrompt(
  bundle: AIContextBundle,
  targetAllocation: Record<string, number>,
): string {
  const currentAllocation = bundle.portfolio.assetAllocation;
  const driftLines = Object.entries(targetAllocation)
    .map(([cls, target]) => {
      const current = currentAllocation[cls as keyof typeof currentAllocation] ?? 0;
      const drift = current - target;
      const flag = Math.abs(drift) > 5 ? '⚠️ REBALANCE' : '✅';
      return `  - ${cls}: Target ${target}% | Current ${current.toFixed(1)}% | Drift ${drift >= 0 ? '+' : ''}${drift.toFixed(1)}% ${flag}`;
    })
    .join('\n');

  return `
Portfolio Rebalancing Check for ${bundle.user.name}

**Portfolio Value:** ₹${bundle.portfolio.totalValue.toLocaleString('en-IN')}
**Risk Profile:** ${bundle.user.riskProfile}

**Allocation Drift Analysis:**
${driftLines}

Rebalancing is recommended when any asset class drifts >5% from target.

Provide:
1. Which asset classes are over/underweight
2. Specific actions: what to sell/reduce and what to buy/increase
3. Tax implications of rebalancing (LTCG if held >1yr for equity, etc.)
4. Whether to rebalance via new investments (preferred — no tax event) or selling
5. Priority order if they can only partially rebalance this month

Note: For tax efficiency, prefer rebalancing through new SIPs/investments before selling existing holdings.
`.trim();
}

// ─── 6. Wealth Growth Roadmap (Premium+) ─────────────────────────────────────

export function buildWealthRoadmapPrompt(bundle: AIContextBundle): string {
  const yearsTo40 = Math.max(0, 40 - bundle.user.age);
  const yearsTo50 = Math.max(0, 50 - bundle.user.age);
  const yearsTo60 = Math.max(0, 60 - bundle.user.age);

  return `
Create a 10-year Wealth Growth Roadmap for ${bundle.user.name}.

**Current Financial Position:**
- Age: ${bundle.user.age} | Net Worth: ₹${bundle.metrics?.netWorth?.toLocaleString('en-IN') ?? 'N/A'}
- Monthly Income: ₹${bundle.user.monthlyIncome.toLocaleString('en-IN')}
- Savings Rate: ${bundle.user.savingsRate}%
- Risk Profile: ${bundle.user.riskProfile}

**Life Stage Context:**
- Years to age 40: ${yearsTo40} | Years to age 50: ${yearsTo50} | Years to retirement (60): ${yearsTo60}

**Build a roadmap covering:**

**Phase 1 (Next 12 months) — Foundation:**
- Emergency fund target
- Insurance gaps to close
- High-interest debt to eliminate
- SIPs to start or increase

**Phase 2 (Years 2-3) — Acceleration:**
- Net worth target
- Asset allocation to build toward
- New investment vehicles to explore (index funds, NPS, ELSS)
- Income growth strategies (skills, side income)

**Phase 3 (Years 4-7) — Compounding:**
- First major wealth milestone
- Portfolio diversification expansion
- Real estate consideration timeline
- Goal achievement checkpoints

**Phase 4 (Years 8-10) — Optimization:**
- Portfolio sophistication (international ETFs, REITs if relevant)
- Tax optimization strategies
- Legacy/estate planning basics
- Retirement corpus trajectory

Include specific net worth milestones for ages ${bundle.user.age + 1}, ${bundle.user.age + 3}, ${bundle.user.age + 5}, ${bundle.user.age + 10}.
Be aspirational but grounded in their actual current numbers.
`.trim();
}

// ─── 7. Tax Efficiency Optimizer (Premium+) ──────────────────────────────────

export function buildTaxOptimizerPrompt(
  bundle: AIContextBundle,
  financialYear: string,
): string {
  const income = bundle.user.monthlyIncome * 12;
  const annualIncome = income;

  return `
Tax Efficiency Analysis for ${bundle.user.name} — FY ${financialYear}

**Annual Income:** ₹${annualIncome.toLocaleString('en-IN')}
**Tax Regime:** Assume New Regime unless specified (compare both)

**Analyze and Recommend:**

1. **Section 80C (₹1.5L limit)** — Current usage vs remaining capacity
   - ELSS, PPF, EPF, life insurance premium, home loan principal
   - Current utilization from profile: [calculate from holdings]

2. **Section 80CCD(1B)** — Additional NPS contribution up to ₹50,000
   - NPS current holding: ₹${(bundle.portfolio.assetAllocation['nps'] ?? 0)}% of portfolio

3. **Section 80D** — Health insurance premium deduction
   - Current health insurance: ${bundle.user.insurancePolicies.some((p) => p.type === 'health') ? 'Active' : '⚠️ None'}

4. **LTCG Harvesting** — Equity gains up to ₹1L exempt annually
   - Current equity portfolio performance assessment

5. **HRA / Home Loan Interest (80EEA)** — If applicable

6. **New vs Old Regime Recommendation** — Which saves more tax at this income level?

7. **Quick Wins Before Year End** — What should they do in next 30 days to save maximum tax?

Calculate estimated tax savings from each recommendation. Prioritize by savings potential.
Always note: "Consult a CA for implementation — tax laws change annually."
`.trim();
}

// ─── Feature Guard ────────────────────────────────────────────────────────────

export function isFeatureAvailable(
  feature: string,
  plan: keyof typeof FEATURE_PLAN_MAP,
): boolean {
  return (FEATURE_PLAN_MAP[plan] as readonly string[]).includes(feature);
}

export function assertFeatureAccess(
  feature: string,
  plan: keyof typeof FEATURE_PLAN_MAP,
): void {
  if (!isFeatureAvailable(feature, plan)) {
    throw new Error(
      `Feature "${feature}" is not available on the "${plan}" plan. Upgrade to access this feature.`,
    );
  }
}
