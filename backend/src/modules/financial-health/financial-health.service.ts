import { prisma } from "../../services/prisma";
import { cache } from "../../services/redis";
import { logger } from "../../services/logger";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoreComponent {
  score:    number;
  maxScore: number;
  label:    string;
  weight:   number;
}

export interface HealthScoreResult {
  score:           number;
  grade:           string;
  breakdown:       Record<string, ScoreComponent>;
  strengths:       string[];
  weaknesses:      string[];
  recommendations: string[];
}

// ─── Grade Map ────────────────────────────────────────────────────────────────

function getGrade(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Attention";
}

// ─── Component Scorers ────────────────────────────────────────────────────────

function scoreSavingsRate(savingsRate: number): ScoreComponent {
  // Weight: 25%
  let score: number;
  let label: string;
  if (savingsRate >= 30)      { score = 25; label = "Excellent — top tier saver (≥30%)"; }
  else if (savingsRate >= 20) { score = 20; label = "Very good — meeting recommended 20%"; }
  else if (savingsRate >= 15) { score = 15; label = "Good — slightly below 20% target"; }
  else if (savingsRate >= 10) { score = 8;  label = "Fair — below recommended savings rate"; }
  else                        { score = 2;  label = "Critical — very low savings rate (<10%)"; }
  return { score, maxScore: 25, label, weight: 25 };
}

function scoreEmergencyFund(months: number): ScoreComponent {
  // Weight: 20%
  let score: number;
  let label: string;
  if (months >= 6)      { score = 20; label = "Fully funded — 6+ months covered"; }
  else if (months >= 5) { score = 16; label = "Nearly there — build 1 more month"; }
  else if (months >= 3) { score = 10; label = "Partial — target 6 months"; }
  else if (months >= 1) { score = 5;  label = "Minimal — high financial risk"; }
  else                  { score = 0;  label = "None — critical vulnerability"; }
  return { score, maxScore: 20, label, weight: 20 };
}

function scoreDebtBurden(emiToIncomeRatio: number): ScoreComponent {
  // Weight: 20% — ratio is 0-1 (e.g. 0.35 = 35% of income goes to EMI)
  const pct = emiToIncomeRatio * 100;
  let score: number;
  let label: string;
  if (pct < 15)       { score = 20; label = "Excellent — low debt burden (<15%)"; }
  else if (pct < 25)  { score = 16; label = "Good — manageable debt (15-25%)"; }
  else if (pct < 35)  { score = 10; label = "Moderate — approaching safe limit (25-35%)"; }
  else if (pct < 50)  { score = 5;  label = "High — debt limiting wealth building (35-50%)"; }
  else                { score = 0;  label = "Critical — debt overwhelming income (>50%)"; }
  return { score, maxScore: 20, label, weight: 20 };
}

function scoreGoalProgress(goals: Array<{ targetAmount: number; currentAmount: number; targetDate?: Date | null }>): ScoreComponent {
  // Weight: 15%
  if (goals.length === 0) {
    return { score: 8, maxScore: 15, label: "No goals set — define goals to improve", weight: 15 };
  }
  const scores = goals.map((g) => {
    const pct = g.currentAmount / g.targetAmount;
    if (!g.targetDate) return pct >= 0.5 ? 15 : 8;
    const monthsLeft = Math.max(1, (g.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
    const monthlyRequired = (g.targetAmount - g.currentAmount) / monthsLeft;
    return monthlyRequired < g.targetAmount * 0.02 ? 15 : pct > 0.5 ? 10 : 5;
  });
  const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
  const score = Math.round(avg);
  const onTrack = scores.filter((s) => s >= 13).length;
  return { score, maxScore: 15, label: `${onTrack}/${goals.length} goals on track`, weight: 15 };
}

function scoreDiversification(assetTypes: string[]): ScoreComponent {
  // Weight: 10%
  const unique = new Set(assetTypes).size;
  let score: number;
  let label: string;
  if (unique >= 6)      { score = 10; label = "Excellent — 6+ asset classes"; }
  else if (unique >= 4) { score = 8;  label = "Good — 4-5 asset classes"; }
  else if (unique >= 2) { score = 5;  label = "Moderate — add more asset classes"; }
  else if (unique === 1){ score = 2;  label = "Concentrated — single asset class risk"; }
  else                  { score = 0;  label = "No investments recorded"; }
  return { score, maxScore: 10, label, weight: 10 };
}

function scoreInvestmentConsistency(hasSIP: boolean, totalAssetValue: number): ScoreComponent {
  // Weight: 10%
  if (hasSIP && totalAssetValue > 0)    return { score: 10, maxScore: 10, label: "Active SIPs — consistent investor", weight: 10 };
  if (totalAssetValue > 0)              return { score: 5,  maxScore: 10, label: "Invested but no regular SIPs", weight: 10 };
  return { score: 0, maxScore: 10, label: "No investments — start a SIP today", weight: 10 };
}

// ─── Main Service ─────────────────────────────────────────────────────────────

export class FinancialHealthService {
  async calculate(userId: string): Promise<HealthScoreResult> {
    const cacheKey = `health_score:${userId}`;
    const cached = await cache.get<HealthScoreResult>(cacheKey);
    if (cached) return cached;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        goals: { where: { status: "ACTIVE" } },
        portfolios: {
          where: { isDefault: true },
          include: { assets: true },
        },
        loans: { where: { isActive: true } },
      },
    });

    const monthlyIncome  = Number(user.monthlyIncome  ?? 0);
    const monthlyExpenses = Number(user.monthlyExpenses ?? 0);
    const savings        = monthlyIncome - monthlyExpenses;
    const savingsRate    = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;
    const emergencyMonths = Number(user.emergencyFundMonths ?? 0);
    const totalEMIs      = Number(user.totalEMIs ?? 0);
    const emiRatio       = monthlyIncome > 0 ? totalEMIs / monthlyIncome : 0;

    const defaultPortfolio = user.portfolios[0];
    const assets = defaultPortfolio?.assets ?? [];
    const assetTypes = assets.map((a) => a.type);
    const totalAssetValue = assets.reduce((s, a) => s + Number(a.avgBuyPrice) * Number(a.quantity), 0);
    const hasSIP = user.goals.some((g) => g.monthlySIP && Number(g.monthlySIP) > 0);

    const breakdown: Record<string, ScoreComponent> = {
      savingsRate:           scoreSavingsRate(savingsRate),
      emergencyFund:         scoreEmergencyFund(emergencyMonths),
      debtBurden:            scoreDebtBurden(emiRatio),
      goalProgress:          scoreGoalProgress(
        user.goals.map((g) => ({
          targetAmount:  Number(g.targetAmount),
          currentAmount: Number(g.currentAmount),
          targetDate:    g.targetDate,
        }))
      ),
      diversification:       scoreDiversification(assetTypes),
      investmentConsistency: scoreInvestmentConsistency(hasSIP, totalAssetValue),
    };

    const score = Object.values(breakdown).reduce((s, c) => s + c.score, 0);
    const grade = getGrade(score);

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    for (const [key, comp] of Object.entries(breakdown)) {
      const ratio = comp.score / comp.maxScore;
      if (ratio >= 0.8) strengths.push(comp.label);
      else if (ratio < 0.5) {
        weaknesses.push(comp.label);
        recommendations.push(this.getRecommendation(key, comp.score, comp.maxScore, { savingsRate, emergencyMonths, emiRatio }));
      }
    }

    const result: HealthScoreResult = { score, grade, breakdown, strengths, weaknesses, recommendations };

    // Cache for 1 hour; also persist to DB
    await Promise.all([
      cache.set(cacheKey, result, 3600),
      prisma.user.update({
        where: { id: userId },
        data: {
          financialHealthScore: score,
          financialHealthGrade: grade,
          lastHealthScoreAt:    new Date(),
        },
      }),
    ]);

    logger.info("Health score calculated", { userId, score, grade });
    return result;
  }

  async invalidateCache(userId: string): Promise<void> {
    await cache.del(`health_score:${userId}`);
  }

  private getRecommendation(
    key: string,
    score: number,
    maxScore: number,
    ctx: { savingsRate: number; emergencyMonths: number; emiRatio: number },
  ): string {
    const recs: Record<string, string> = {
      savingsRate: `Increase savings rate from ${ctx.savingsRate.toFixed(0)}% to 20%. Start by cutting one expense category by 10%.`,
      emergencyFund: `Build emergency fund to 6 months (currently ${ctx.emergencyMonths.toFixed(1)} months). Set up an auto-transfer to a liquid fund.`,
      debtBurden: `EMI-to-income ratio is ${(ctx.emiRatio * 100).toFixed(0)}%. Target below 25%. Focus on prepaying highest-interest loan first.`,
      goalProgress: "Review and update goal SIP amounts. At least one goal is behind schedule.",
      diversification: "Diversify portfolio across 4+ asset classes: equity, debt, gold, and cash equivalents.",
      investmentConsistency: "Start a monthly SIP of even ₹1,000 to build the habit of consistent investing.",
    };
    return recs[key] ?? "Review this area of your finances with a financial advisor.";
  }
}

export const financialHealthService = new FinancialHealthService();
