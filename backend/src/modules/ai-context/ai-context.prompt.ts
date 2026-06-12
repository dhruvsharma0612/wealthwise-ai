import type { AIContextBundle } from "./ai-context-bundle.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(amount: number, currency = "INR"): string {
  if (currency === "INR") {
    if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
    if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(2)}L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

function emiFlag(ratio: number): string {
  if (ratio > 0.5) return "🔴 CRITICAL";
  if (ratio > 0.35) return "🟠 HIGH";
  if (ratio > 0.25) return "🟡 MODERATE";
  return "✅ HEALTHY";
}

function emergencyFlag(months: number): string {
  if (months >= 6) return "✅ FULLY FUNDED";
  if (months >= 3) return "🟡 PARTIAL";
  return "🔴 INSUFFICIENT";
}

// ─── System Prompt ────────────────────────────────────────────────────────────

export const WEALTHWISE_SYSTEM_PROMPT = `
You are WealthWise AI — a trusted Personal CFO (Chief Financial Officer).

You are not a generic chatbot. You are a deeply personalized, empathetic, and highly competent financial advisor who knows the user's complete financial picture and speaks to them like a trusted mentor who genuinely wants them to succeed financially.

ADVISORY HIERARCHY — evaluate silently before every response:
1. Income Stability — is income reliable?
2. Emergency Fund — is 6 months of expenses covered?
3. Debt Burden — is EMI-to-income ratio under 35%?
4. Insurance Coverage — term life + health insurance adequate?
5. Goal Progress — are financial goals on track?
6. Asset Allocation — portfolio aligned with risk profile?
7. Tax Efficiency — using 80C, NPS, ELSS optimally?
8. Wealth Growth — advanced strategies only after above are healthy

RULES (non-negotiable):
- Never guarantee investment returns — say "historically" or "expected"
- Never recommend leverage or margin trading
- Never make crypto the primary recommendation
- Always mention risks alongside any investment suggestion
- Always recommend diversification
- Consider Indian tax implications (LTCG, STCG, 80C, 80D, 80CCD)
- Recommend consulting a SEBI-registered advisor for large decisions

COMMUNICATION STYLE:
- Warm, direct, and specific — like a trusted friend who is also an expert
- Reference the user's actual numbers, not generic advice
- Use ₹ and lakh/crore notation for Indian users
- End every response with one clear next action
- Keep responses concise and scannable
- Use the user's first name naturally

When responding with structured analysis, use JSON only when explicitly requested.
`.trim();

// ─── Context Prompt Builder ───────────────────────────────────────────────────

export function buildAIContextPrompt(bundle: AIContextBundle): string {
  const { userProfile: u, financialHealth: fh, goals, portfolio, loans, monthlyIncome, monthlyExpenses, monthlySavings } = bundle;

  const currency = u.currency;

  // ── USER PROFILE ──────────────────────────────────────────────────────────
  const profileSection = `
## USER PROFILE
- Name: ${u.name}
- Age: ${u.age ?? "Not provided"} | Occupation: ${u.occupation ?? "Not provided"}
- Country: ${u.country} | Currency: ${currency}
- Marital Status: ${u.maritalStatus ?? "Not provided"} | Dependents: ${u.dependents}
- Plan: ${u.plan}`.trim();

  // ── FINANCIAL HEALTH ──────────────────────────────────────────────────────
  const healthSection = `
## FINANCIAL HEALTH SCORE: ${fh.score}/100 — ${fh.grade}
- Monthly Income:   ${fmt(monthlyIncome, currency)}
- Monthly Expenses: ${fmt(monthlyExpenses, currency)}
- Monthly Savings:  ${fmt(monthlySavings, currency)} (${fh.savingsRate}% savings rate)
- Emergency Fund:   ${fh.emergencyMonths.toFixed(1)} months ${emergencyFlag(fh.emergencyMonths)}
- EMI-to-Income:    ${(fh.emiToIncomeRatio * 100).toFixed(1)}% ${emiFlag(fh.emiToIncomeRatio)}
${fh.strengths.length    ? `- Strengths: ${fh.strengths.join(" | ")}` : ""}
${fh.weaknesses.length   ? `- Weaknesses: ${fh.weaknesses.join(" | ")}` : ""}`.trim();

  // ── GOALS ──────────────────────────────────────────────────────────────────
  const goalsSection = goals.length === 0
    ? "## GOALS\n- No goals set yet."
    : `## GOALS (${goals.length} active)
${goals.map((g) => {
  const icon = g.progressPct >= 75 ? "🟢" : g.progressPct >= 40 ? "🟡" : "🔴";
  const target = g.targetDate ? ` by ${new Date(g.targetDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}` : "";
  return `${icon} ${g.title} (${g.category}) — ${g.progressPct}% complete | ${fmt(g.currentAmount, currency)} / ${fmt(g.targetAmount, currency)}${target} | SIP: ${fmt(g.monthlySIP, currency)}/mo`;
}).join("\n")}`.trim();

  // ── PORTFOLIO ──────────────────────────────────────────────────────────────
  const portfolioSection = portfolio
    ? `## PORTFOLIO
- Total Value: ${fmt(portfolio.totalValue, portfolio.currency)}
- Holdings: ${portfolio.assetCount} assets
- Allocation: ${Object.entries(portfolio.assetAllocation).map(([t, p]) => `${t} ${p}%`).join(", ")}
- Top Holdings: ${portfolio.topHoldings.map((h) => `${h.name} (${h.type}) ${h.allocationPct}%`).join(", ")}`
    : "## PORTFOLIO\n- No portfolio data recorded yet.";

  // ── LOANS ─────────────────────────────────────────────────────────────────
  const loansSection = loans.length === 0
    ? "## LOANS\n- No active loans."
    : `## LOANS (${loans.length} active)
${loans.map((l) => `- ${l.type.toUpperCase()}: ${fmt(l.outstandingAmount, currency)} outstanding | EMI ${fmt(l.monthlyEmi, currency)}/mo @ ${l.interestRate}% | ${l.remainingMonths} months left`).join("\n")}`;

  // ── RECENT CHAT ────────────────────────────────────────────────────────────
  const chatSection = bundle.recentChats.length > 0
    ? `## RECENT CONVERSATION CONTEXT\n${bundle.recentChats.map((m) => `[${m.role.toUpperCase()}]: ${m.content}`).join("\n")}`
    : "";

  // ── ADVISORY NOTES ─────────────────────────────────────────────────────────
  const advisoryNotes: string[] = [];
  if (fh.emergencyMonths < 3)             advisoryNotes.push("⚠️ PRIORITY: Emergency fund is critically low — address before investing.");
  if (fh.emiToIncomeRatio > 0.5)          advisoryNotes.push("⚠️ PRIORITY: Debt burden is critical — focus on debt reduction first.");
  if (fh.savingsRate < 10)                advisoryNotes.push("⚠️ PRIORITY: Savings rate is very low — find ways to reduce expenses.");
  if (!bundle.hasCompletedOnboarding)     advisoryNotes.push("ℹ️ User has not completed financial profile onboarding.");

  const advisorySection = advisoryNotes.length > 0
    ? `## ADVISORY PRIORITIES\n${advisoryNotes.join("\n")}`
    : "";

  return [profileSection, healthSection, goalsSection, portfolioSection, loansSection, advisorySection, chatSection]
    .filter(Boolean)
    .join("\n\n");
}

// ─── Full Message Builder ─────────────────────────────────────────────────────

export function buildMessages(
  bundle: AIContextBundle,
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
) {
  const contextPrompt = buildAIContextPrompt(bundle);

  const systemWithContext = `${WEALTHWISE_SYSTEM_PROMPT}

---

${contextPrompt}`;

  return {
    system:   systemWithContext,
    messages: [
      ...conversationHistory,
      { role: "user" as const, content: userMessage },
    ],
  };
}
