// ─── WealthWise Differentiation Strategy ─────────────────────────────────────
// Analysis of how WealthWise wins against CRED, INDmoney, ET Money, Walnut.
// This file is a strategic reference — not runtime code.

/**
 * COMPETITOR LANDSCAPE ANALYSIS
 * ──────────────────────────────
 *
 * CRED
 *   Core: Credit card bill payments, rewards, CIBIL score
 *   Weakness: No real financial planning. Rewards = dopamine trap.
 *   WealthWise angle: "CRED rewards you for spending. We reward you for saving."
 *
 * INDmoney
 *   Core: Portfolio aggregation, US stocks, mutual funds, salary account
 *   Weakness: Dashboard-heavy, AI is shallow (rule-based, not reasoning),
 *             advice is generic, no behavioral coaching
 *   WealthWise angle: "INDmoney shows you numbers. We tell you what to do with them."
 *
 * ET Money
 *   Core: Mutual fund distribution, SIP, ELSS
 *   Weakness: Distribution-first (earns commissions), advice biased toward
 *             selling funds, no holistic view
 *   WealthWise angle: "ET Money sells funds. We sell financial clarity."
 *
 * Walnut
 *   Core: Expense tracking via SMS parsing
 *   Weakness: Tracking only, no advice, no investing, no goals, no AI
 *   WealthWise angle: Walnut tells you where money went. We tell you where it should go."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WEALTHWISE DIFFERENTIATORS (Buildable by a Small Team)
 * ───────────────────────────────────────────────────────
 *
 * 1. GENUINE AI REASONING (Not Rule-Based)
 *    - Claude reasons about the FULL financial picture, not rules like "savings < 20% → alert"
 *    - The AI considers context: Is income irregular? Are they going through a life event?
 *    - Responses feel like a conversation with a smart CFO, not a dashboard notification
 *    - Build: Claude API + rich context injection (this codebase)
 *
 * 2. FINANCIAL HEALTH HIERARCHY ENFORCEMENT
 *    - No competitor enforces the foundation-first hierarchy
 *    - A user with no emergency fund who asks about crypto gets redirected — every time
 *    - Build: Hierarchy check baked into system prompt + deterministic pre-check
 *
 * 3. PROACTIVE CFO MODE (Not Reactive Chatbot)
 *    - Weekly AI-generated check-in surfaces issues the user didn't know to ask about
 *    - "I noticed your food delivery spend is up 40% — here's what that costs annually"
 *    - No competitor does proactive, personalized narrative — they send push notifications
 *    - Build: Weekly cron job runs monthly review prompt, delivers via push/email
 *
 * 4. SPENDING LEAK DETECTOR WITH NARRATIVE
 *    - Not just "you spent ₹12k on food" — but "Zomato, Swiggy, Blinkit together cost you
 *      ₹9,600/mo = ₹1.15L/year = 38% of a full emergency fund. Here's a 30-day fix."
 *    - Build: Transaction categorization + AI narrative generation
 *
 * 5. GOAL-FIRST INVESTING (Not Product-First)
 *    - ET Money shows mutual funds. WealthWise shows "your house down payment needs ₹45L
 *      in 5 years. Here are 3 SIP strategies that get you there."
 *    - Every investment recommendation is anchored to a user goal
 *    - Build: Goal-to-instrument mapping engine + AI personalization
 *
 * 6. HONEST, COMMISSION-FREE ADVICE
 *    - WealthWise doesn't earn distribution commissions on mutual funds
 *    - This is a trust moat that compounds — users feel the difference
 *    - Build: Direct plan mutual fund integrations (MFU, BSE StarMF)
 *
 * 7. LIFE EVENT DETECTION + FINANCIAL RESPONSE
 *    - When a user mentions "I'm getting married" or "we're expecting a baby", the AI
 *      proactively restructures their financial plan — without being asked
 *    - No competitor does this. Life events are the #1 trigger for financial decisions
 *    - Build: Named entity recognition on user messages → life event triggers →
 *             specialized prompt modules
 *
 * 8. BEHAVIORAL FINANCE INTEGRATION
 *    - Most apps assume users are rational. They're not.
 *    - WealthWise acknowledges loss aversion, recency bias, lifestyle inflation
 *    - The AI coaches around behavioral patterns, not just numbers
 *    - Build: Behavioral tagging in memory system + empathy-first prompting
 *
 * 9. FAMILY FINANCIAL PLANNING (Underserved Segment)
 *    - Married users with kids have wildly different financial needs
 *    - WealthWise can model: education costs, joint goals, dependent insurance,
 *      estate basics — no competitor does this for the middle market
 *    - Build: Family profile module + multi-goal optimizer
 *
 * 10. FINANCIAL EDUCATION EMBEDDED IN ADVICE
 *     - Every time WealthWise uses a term (LTCG, XIRR, expense ratio), it explains it in context
 *     - Over time, users get smarter — which creates loyalty and referrals
 *     - Build: Jargon detection → inline explanation injection
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * POSITIONING STATEMENT
 * ──────────────────────
 * WealthWise is the only personal finance platform that thinks before it advises.
 * While others show you dashboards, we give you a plan.
 * While others sell products, we solve problems.
 * While others react when you ask, we act before you need to.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * GO-TO-MARKET FOR SMALL TEAM (Priority Order)
 * ─────────────────────────────────────────────
 * Phase 1: AI financial coach (chat) + health score + goal tracking
 *          → Acquire users with the "free CFO" hook
 *
 * Phase 2: Spending leak detection + monthly review
 *          → Show ROI within 30 days → convert to Pro
 *
 * Phase 3: Portfolio analysis + debt optimizer + retirement planning
 *          → Premium conversion for users with real assets
 *
 * Phase 4: Proactive CFO mode + family planning + tax optimizer
 *          → Elite tier for high-income professionals and families
 */

export const DIFFERENTIATION_STRATEGY = {
  tagline: 'Your money. Understood. Optimized. Growing.',
  positioningVsCREDI: 'CRED rewards you for spending. WealthWise rewards you for saving.',
  positioningVsINDmoney: 'INDmoney shows you numbers. We tell you what to do with them.',
  positioningVsETMoney: 'ET Money sells funds. We sell financial clarity.',
  positioningVsWalnut: 'Walnut tells you where your money went. We tell you where it should go.',

  coreMonat: [
    'AI that reasons, not just rules',
    'Foundation-first hierarchy enforcement',
    'Proactive CFO check-ins',
    'Commission-free, goal-first advice',
    'Behavioral finance awareness',
    'Life event detection and response',
  ],

  mvpFeaturePriority: [
    { phase: 1, feature: 'AI Financial Coach Chat', conversionRole: 'acquisition' },
    { phase: 1, feature: 'Financial Health Score', conversionRole: 'activation' },
    { phase: 1, feature: 'Goal Tracking', conversionRole: 'retention' },
    { phase: 2, feature: 'Spending Leak Detection', conversionRole: 'pro_conversion' },
    { phase: 2, feature: 'Monthly Review', conversionRole: 'pro_retention' },
    { phase: 3, feature: 'Portfolio Analyzer', conversionRole: 'premium_conversion' },
    { phase: 3, feature: 'Debt Optimizer', conversionRole: 'premium_retention' },
    { phase: 3, feature: 'Retirement Planner', conversionRole: 'premium_conversion' },
    { phase: 4, feature: 'Proactive CFO Mode', conversionRole: 'elite_conversion' },
    { phase: 4, feature: 'Family Financial Planning', conversionRole: 'elite_expansion' },
    { phase: 4, feature: 'Tax Efficiency Optimizer', conversionRole: 'elite_retention' },
  ],
} as const;
