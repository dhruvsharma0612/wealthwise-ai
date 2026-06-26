import { prisma } from "../../services/prisma";
import { cache } from "../../services/redis";
import { financialHealthService } from "../financial-health/financial-health.service";
import { cashflowService } from "../cashflow/cashflow.service";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfileContext {
  name:                string;
  age:                 number | null;
  occupation:          string | null;
  country:             string;
  currency:            string;
  maritalStatus:       string | null;
  dependents:          number;
  plan:                string;
  onboardingCompleted: boolean;
}

export interface FinancialHealthContext {
  score:           number;
  grade:           string;
  strengths:       string[];
  weaknesses:      string[];
  recommendations: string[];
  savingsRate:     number;
  emergencyMonths: number;
  emiToIncomeRatio: number;
}

export interface GoalContext {
  id:            string;
  title:         string;
  category:      string;
  targetAmount:  number;
  currentAmount: number;
  targetDate:    string | null;
  progressPct:   number;
  monthlySIP:    number;
  currency:      string;
  priority:      string;
  status:        string;
}

export interface PortfolioContext {
  totalValue:        number;
  currency:          string;
  assetCount:        number;
  assetAllocation:   Record<string, number>; // type → % of portfolio
  topHoldings:       Array<{ name: string; type: string; value: number; allocationPct: number }>;
}

export interface LoanContext {
  type:             string;
  outstandingAmount: number;
  monthlyEmi:       number;
  interestRate:     number;
  remainingMonths:  number;
}

export interface RecentChatContext {
  role:      string;
  content:   string;
  createdAt: string;
}

export interface AIContextBundle {
  userProfile:    UserProfileContext;
  financialHealth: FinancialHealthContext;
  goals:          GoalContext[];
  portfolio:      PortfolioContext | null;
  loans:          LoanContext[];
  recentChats:    RecentChatContext[];
  monthlyIncome:  number;
  monthlyExpenses: number;
  monthlySavings: number;
  hasCompletedOnboarding: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class AIContextBundleService {

  async build(userId: string, sessionId?: string): Promise<AIContextBundle> {
    const cacheKey = `ai_context:${userId}`;
    const cached   = await cache.get<AIContextBundle>(cacheKey);
    if (cached) return cached;

    // Fetch all data in parallel
    const [user, healthScore, cashflow, goals, defaultPortfolio, loans, recentMessages] = await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          firstName: true, lastName: true, age: true, occupation: true,
          country: true, currency: true, maritalStatus: true, dependents: true, plan: true,
          monthlyIncome: true, monthlyExpenses: true, monthlySavings: true, savingsRate: true,
          emergencyFundMonths: true, totalEMIs: true, onboardingCompleted: true,
          financialHealthScore: true, financialHealthGrade: true,
        },
      }),
      financialHealthService.calculate(userId),
      // Prefer real tracked cashflow; fall back to onboarding aggregates below.
      cashflowService.actuals(userId),
      prisma.goal.findMany({
        where:   { userId, status: "ACTIVE" },
        orderBy: { priority: "asc" },
      }),
      prisma.portfolio.findFirst({
        where:   { userId, isDefault: true },
        include: { assets: { orderBy: { updatedAt: "desc" } } },
      }),
      prisma.loan.findMany({
        where:   { userId, isActive: true },
        orderBy: { interestRate: "desc" },
      }),
      // Last 10 messages for context (skip if no session)
      sessionId
        ? prisma.chatMessage.findMany({
            where:   { sessionId },
            orderBy: { createdAt: "desc" },
            take:    10,
            select:  { role: true, content: true, createdAt: true },
          })
        : Promise.resolve([]),
    ]);

    const monthlyIncome   = cashflow.hasData ? cashflow.monthlyIncome   : Number(user.monthlyIncome   ?? 0);
    const monthlyExpenses = cashflow.hasData ? cashflow.monthlyExpenses : Number(user.monthlyExpenses ?? 0);
    const monthlySavings  = cashflow.hasData ? cashflow.monthlySavings  : Number(user.monthlySavings  ?? 0);
    const emergencyMonths = Number(user.emergencyFundMonths ?? 0);
    const totalEMIs       = Number(user.totalEMIs ?? 0);

    // ── Portfolio context ───────────────────────────────────────────────────

    let portfolioContext: PortfolioContext | null = null;
    if (defaultPortfolio && defaultPortfolio.assets.length > 0) {
      const assets       = defaultPortfolio.assets;
      const totalValue   = assets.reduce((s, a) => s + Number(a.avgBuyPrice) * Number(a.quantity), 0);
      const byType       = assets.reduce<Record<string, number>>((acc, a) => {
        const val      = Number(a.avgBuyPrice) * Number(a.quantity);
        acc[a.type]    = (acc[a.type] ?? 0) + val;
        return acc;
      }, {});
      const alloc        = Object.fromEntries(
        Object.entries(byType).map(([t, v]) => [t, totalValue > 0 ? Math.round((v / totalValue) * 100) : 0])
      );
      const topHoldings  = assets
        .slice(0, 5)
        .map((a) => {
          const val = Number(a.avgBuyPrice) * Number(a.quantity);
          return { name: a.name, type: a.type, value: val, allocationPct: totalValue > 0 ? Math.round((val / totalValue) * 100) : 0 };
        });

      portfolioContext = {
        totalValue,
        currency:       defaultPortfolio.currency,
        assetCount:     assets.length,
        assetAllocation: alloc,
        topHoldings,
      };
    }

    // ── Goals context ───────────────────────────────────────────────────────

    const goalsContext: GoalContext[] = goals.map((g) => ({
      id:            g.id,
      title:         g.title,
      category:      g.category,
      targetAmount:  Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
      targetDate:    g.targetDate?.toISOString() ?? null,
      progressPct:   Number(g.targetAmount) > 0
        ? Math.round((Number(g.currentAmount) / Number(g.targetAmount)) * 100)
        : 0,
      monthlySIP:    Number(g.monthlySIP ?? 0),
      currency:      g.currency,
      priority:      g.priority,
      status:        g.status,
    }));

    const bundle: AIContextBundle = {
      userProfile: {
        name:                `${user.firstName} ${user.lastName}`,
        age:                 user.age,
        occupation:          user.occupation,
        country:             user.country,
        currency:            user.currency,
        maritalStatus:       user.maritalStatus,
        dependents:          user.dependents,
        plan:                user.plan,
        onboardingCompleted: user.onboardingCompleted,
      },
      financialHealth: {
        score:            healthScore.score,
        grade:            healthScore.grade,
        strengths:        healthScore.strengths,
        weaknesses:       healthScore.weaknesses,
        recommendations:  healthScore.recommendations,
        savingsRate:      monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0,
        emergencyMonths,
        emiToIncomeRatio: monthlyIncome > 0 ? totalEMIs / monthlyIncome : 0,
      },
      goals:          goalsContext,
      portfolio:      portfolioContext,
      loans:          loans.map((l) => ({
        type:             l.type,
        outstandingAmount: Number(l.outstandingAmount),
        monthlyEmi:       Number(l.monthlyEmi),
        interestRate:     Number(l.interestRate),
        remainingMonths:  l.remainingMonths,
      })),
      recentChats: recentMessages.reverse().map((m) => ({
        role:      m.role,
        content:   m.content.slice(0, 500), // truncate for context window efficiency
        createdAt: m.createdAt.toISOString(),
      })),
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      hasCompletedOnboarding: user.onboardingCompleted,
    };

    // Cache for 5 minutes — invalidated on profile updates
    await cache.set(cacheKey, bundle, 300);
    return bundle;
  }

  async invalidate(userId: string): Promise<void> {
    await cache.del(`ai_context:${userId}`);
  }
}

export const aiContextBundleService = new AIContextBundleService();
