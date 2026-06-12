import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../../services/prisma";
import { logger } from "../../services/logger";
import { AppError } from "../../middleware/errorHandler";
import { aiContextBundleService } from "../ai-context/ai-context-bundle.service";
import { WEALTHWISE_SYSTEM_PROMPT, buildAIContextPrompt } from "../ai-context/ai-context.prompt";

const MODEL = "claude-sonnet-4-6";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MonthlyReviewInput {
  month:          string;   // "2026-06"
  incomeReceived: number;
  totalSpent:     number;
  totalInvested:  number;
  expenseBreakdown?: Record<string, number>; // { food: 5000, transport: 2000 }
}

export interface MonthlyReviewResult {
  month:           string;
  summary:         string;
  wins:            string[];
  concerns:        string[];
  recommendations: string[];
  nextMonthFocus:  string[];
  savingsRate:     number;
  healthScore:     number;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildMonthlyReviewPrompt(
  contextSection: string,
  input: MonthlyReviewInput,
  currency: string,
): string {
  const totalSaved  = input.incomeReceived - input.totalSpent;
  const savingsRate = input.incomeReceived > 0
    ? Math.round((totalSaved / input.incomeReceived) * 100)
    : 0;

  const expenseLines = input.expenseBreakdown
    ? Object.entries(input.expenseBreakdown)
        .sort(([, a], [, b]) => b - a)
        .map(([cat, amt]) => `  - ${cat}: ${currency === "INR" ? "₹" : ""}${amt.toLocaleString("en-IN")} (${input.incomeReceived > 0 ? Math.round((amt / input.incomeReceived) * 100) : 0}% of income)`)
        .join("\n")
    : "  - No category breakdown provided";

  return `
${contextSection}

---

## MONTHLY REVIEW DATA — ${input.month}

Financial Summary:
- Income This Month:   ${currency === "INR" ? "₹" : ""}${input.incomeReceived.toLocaleString("en-IN")}
- Total Spent:         ${currency === "INR" ? "₹" : ""}${input.totalSpent.toLocaleString("en-IN")}
- Total Saved:         ${currency === "INR" ? "₹" : ""}${totalSaved.toLocaleString("en-IN")}
- Total Invested:      ${currency === "INR" ? "₹" : ""}${input.totalInvested.toLocaleString("en-IN")}
- Savings Rate:        ${savingsRate}%

Expense Breakdown:
${expenseLines}

---

Generate a Monthly Financial Review for ${input.month} in this EXACT JSON format (no extra text):
{
  "summary": "2-3 sentence overall assessment of this month's financial performance",
  "wins": ["specific achievement 1", "specific achievement 2"],
  "concerns": ["specific concern 1 with numbers", "specific concern 2 with numbers"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
  "nextMonthFocus": ["priority 1 for next month", "priority 2", "priority 3"]
}

Rules:
- Reference actual numbers (income, savings, specific categories)
- Wins must be genuine (do not manufacture wins if month was poor)
- Concerns must be specific and actionable, not vague
- Recommendations must be achievable within 30 days
- Tone: honest, encouraging, CFO-like — not generic
`.trim();
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class MonthlyReviewService {
  private readonly claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  async generate(userId: string, input: MonthlyReviewInput): Promise<MonthlyReviewResult> {
    // Prevent duplicate reviews for the same month
    const existing = await prisma.monthlyReview.findUnique({
      where: { userId_month: { userId, month: input.month } },
    });
    if (existing) {
      return {
        month:           existing.month,
        summary:         existing.summary,
        wins:            existing.wins as string[],
        concerns:        existing.concerns as string[],
        recommendations: existing.recommendations as string[],
        nextMonthFocus:  existing.nextMonthFocus as string[],
        savingsRate:     Number(existing.savingsRate),
        healthScore:     existing.healthScore ?? 0,
      };
    }

    const bundle         = await aiContextBundleService.build(userId);
    const contextSection = buildAIContextPrompt(bundle);
    const prompt         = buildMonthlyReviewPrompt(contextSection, input, bundle.userProfile.currency);

    let parsed: Omit<MonthlyReviewResult, "month" | "savingsRate" | "healthScore">;

    try {
      const response = await this.claude.messages.create({
        model:      MODEL,
        max_tokens: 1024,
        system:     WEALTHWISE_SYSTEM_PROMPT,
        messages:   [{ role: "user", content: prompt }],
      });
      const block = response.content.find((b) => b.type === "text");
      const text  = block?.type === "text" ? block.text : "{}";
      const clean = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
      parsed      = JSON.parse(clean);
    } catch (err) {
      logger.error("Monthly review generation failed", { userId, err });
      throw new AppError("Failed to generate monthly review. Please try again.", 503);
    }

    const totalSaved  = input.incomeReceived - input.totalSpent;
    const savingsRate = input.incomeReceived > 0
      ? Math.round((totalSaved / input.incomeReceived) * 100)
      : 0;

    // Persist the review
    await prisma.monthlyReview.create({
      data: {
        userId,
        month:           input.month,
        incomeReceived:  input.incomeReceived,
        totalSpent:      input.totalSpent,
        totalSaved,
        totalInvested:   input.totalInvested,
        savingsRate,
        healthScore:     bundle.financialHealth.score,
        summary:         parsed.summary,
        wins:            parsed.wins,
        concerns:        parsed.concerns,
        recommendations: parsed.recommendations,
        nextMonthFocus:  parsed.nextMonthFocus,
        rawExpenses:     input.expenseBreakdown ?? {},
      },
    });

    logger.info("Monthly review generated", { userId, month: input.month });

    return {
      month:           input.month,
      summary:         parsed.summary,
      wins:            parsed.wins,
      concerns:        parsed.concerns,
      recommendations: parsed.recommendations,
      nextMonthFocus:  parsed.nextMonthFocus,
      savingsRate,
      healthScore:     bundle.financialHealth.score,
    };
  }

  async getHistory(userId: string, limit = 6) {
    return prisma.monthlyReview.findMany({
      where:   { userId },
      orderBy: { month: "desc" },
      take:    limit,
      select: {
        id: true, month: true, summary: true, savingsRate: true,
        healthScore: true, wins: true, concerns: true, generatedAt: true,
      },
    });
  }

  async getReview(userId: string, month: string) {
    const review = await prisma.monthlyReview.findUnique({
      where: { userId_month: { userId, month } },
    });
    if (!review) throw new AppError(`No review found for ${month}`, 404);
    return review;
  }
}

export const monthlyReviewService = new MonthlyReviewService();
