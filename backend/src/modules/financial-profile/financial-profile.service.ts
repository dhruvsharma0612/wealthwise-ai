import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { financialHealthService } from "../financial-health/financial-health.service";
import type {
  PersonalInfoDto,
  IncomeExpensesDto,
  RiskProfileDto,
  EmergencyLoansDto,
} from "./financial-profile.dto";

export class FinancialProfileService {

  // ─── Get full profile ───────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        age: true, occupation: true, maritalStatus: true, dependents: true,
        country: true, currency: true,
        monthlyIncome: true, monthlyExpenses: true, monthlySavings: true, savingsRate: true,
        emergencyFundMonths: true, emergencyFundAmount: true,
        riskProfile: true, investmentExperience: true,
        insuranceCoverage: true, insuranceDetails: true,
        totalLoans: true, totalEMIs: true,
        onboardingStep: true, onboardingCompleted: true,
        financialHealthScore: true, financialHealthGrade: true, lastHealthScoreAt: true,
        plan: true,
        loans: { where: { isActive: true }, orderBy: { interestRate: "desc" } },
      },
    });
    return user;
  }

  // ─── Step 1: Personal Info ──────────────────────────────────────────────────

  async savePersonalInfo(userId: string, dto: PersonalInfoDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        age:           dto.age,
        occupation:    dto.occupation,
        maritalStatus: dto.maritalStatus,
        dependents:    dto.dependents,
        country:       dto.country,
        currency:      dto.currency,
        onboardingStep: "INCOME_EXPENSES",
      },
      select: { id: true, onboardingStep: true },
    });
    return { success: true, nextStep: user.onboardingStep };
  }

  // ─── Step 2: Income & Expenses ──────────────────────────────────────────────

  async saveIncomeExpenses(userId: string, dto: IncomeExpensesDto) {
    const savings    = dto.monthlyIncome - dto.monthlyExpenses;
    const savingsRate = (savings / dto.monthlyIncome) * 100;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyIncome:   dto.monthlyIncome,
        monthlyExpenses: dto.monthlyExpenses,
        monthlySavings:  savings,
        savingsRate:     savingsRate,
        onboardingStep:  "RISK_PROFILE",
      },
      select: { id: true, onboardingStep: true },
    });
    return { success: true, nextStep: user.onboardingStep };
  }

  // ─── Step 3: Risk Profile ───────────────────────────────────────────────────

  async saveRiskProfile(userId: string, dto: RiskProfileDto) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        riskProfile:          dto.riskProfile,
        investmentExperience: dto.investmentExperience,
        insuranceCoverage:    dto.insuranceCoverage,
        insuranceDetails:     dto.insuranceDetails ?? {},
        onboardingStep:       "EMERGENCY_LOANS",
      },
      select: { id: true, onboardingStep: true },
    });
    return { success: true, nextStep: user.onboardingStep };
  }

  // ─── Step 4: Emergency Fund & Loans ────────────────────────────────────────

  async saveEmergencyAndLoans(userId: string, dto: EmergencyLoansDto) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { monthlyExpenses: true },
    });

    const monthlyExp   = Number(user.monthlyExpenses ?? 0);
    const fundMonths   = monthlyExp > 0 ? dto.emergencyFundAmount / monthlyExp : 0;
    const totalLoans   = dto.loans.reduce((s, l) => s + l.outstandingAmount, 0);
    const totalEMIs    = dto.loans.reduce((s, l) => s + l.monthlyEmi, 0);

    // Delete old loans, insert new ones atomically
    await prisma.$transaction([
      prisma.loan.deleteMany({ where: { userId } }),
      ...dto.loans.map((l) =>
        prisma.loan.create({
          data: {
            userId,
            type:             l.type,
            lenderName:       l.lenderName,
            outstandingAmount: l.outstandingAmount,
            monthlyEmi:       l.monthlyEmi,
            interestRate:     l.interestRate,
            remainingMonths:  l.remainingMonths,
          },
        })
      ),
      prisma.user.update({
        where: { id: userId },
        data: {
          emergencyFundAmount: dto.emergencyFundAmount,
          emergencyFundMonths: fundMonths,
          totalLoans,
          totalEMIs,
          onboardingStep: "GOALS",
        },
      }),
    ]);

    await financialHealthService.invalidateCache(userId);
    return { success: true, nextStep: "GOALS" };
  }

  // ─── Complete onboarding ────────────────────────────────────────────────────

  async completeOnboarding(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: "COMPLETED", onboardingCompleted: true },
    });

    // Trigger initial health score calculation
    const score = await financialHealthService.calculate(userId);
    return { success: true, healthScore: score };
  }

  // ─── Recalculate derived fields after any update ────────────────────────────

  async recalculateDerivedFields(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { monthlyIncome: true, monthlyExpenses: true },
    });
    const income   = Number(user.monthlyIncome ?? 0);
    const expenses = Number(user.monthlyExpenses ?? 0);
    if (income > 0) {
      const savings     = income - expenses;
      const savingsRate = (savings / income) * 100;
      await prisma.user.update({
        where: { id: userId },
        data: { monthlySavings: savings, savingsRate },
      });
    }
    await financialHealthService.invalidateCache(userId);
  }
}

export const financialProfileService = new FinancialProfileService();
