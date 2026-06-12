import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { financialProfileService } from "../financial-profile/financial-profile.service";
import type { GoalsStepDto } from "../financial-profile/financial-profile.dto";

// ─── Onboarding Step Order ────────────────────────────────────────────────────

const STEP_ORDER = [
  "PERSONAL_INFO",
  "INCOME_EXPENSES",
  "RISK_PROFILE",
  "EMERGENCY_LOANS",
  "GOALS",
  "COMPLETED",
] as const;

type Step = (typeof STEP_ORDER)[number];

// ─── Service ──────────────────────────────────────────────────────────────────

export class OnboardingService {

  async getStatus(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        onboardingStep:     true,
        onboardingCompleted: true,
        firstName:          true,
      },
    });

    const currentIndex  = STEP_ORDER.indexOf(user.onboardingStep as Step);
    const totalSteps    = STEP_ORDER.length - 1; // exclude COMPLETED
    const percentDone   = Math.round((currentIndex / totalSteps) * 100);

    return {
      currentStep:        user.onboardingStep,
      completedSteps:     STEP_ORDER.slice(0, currentIndex),
      remainingSteps:     STEP_ORDER.slice(currentIndex, -1),
      percentComplete:    percentDone,
      onboardingCompleted: user.onboardingCompleted,
      welcomeMessage:     `Welcome, ${user.firstName}! Let's set up your financial profile.`,
    };
  }

  async saveGoalsStep(userId: string, dto: GoalsStepDto) {
    // Verify user is at the correct step
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { onboardingStep: true, currency: true },
    });

    if (!["GOALS", "COMPLETED"].includes(user.onboardingStep)) {
      throw new AppError("Complete previous onboarding steps first", 400, "STEP_OUT_OF_ORDER");
    }

    // Create goals
    await prisma.$transaction([
      // Clear existing onboarding goals (idempotent)
      prisma.goal.deleteMany({ where: { userId, status: "ACTIVE" } }),
      ...dto.goals.map((g) =>
        prisma.goal.create({
          data: {
            userId,
            title:         g.title,
            category:      g.category,
            targetAmount:  g.targetAmount,
            currentAmount: g.currentAmount,
            targetDate:    g.targetDate ? new Date(g.targetDate) : null,
            monthlySIP:    g.monthlySIP,
            priority:      g.priority,
            currency:      user.currency,
          },
        })
      ),
    ]);

    return { success: true, goalsCreated: dto.goals.length, nextStep: "COMPLETE_ONBOARDING" };
  }

  async skipStep(userId: string, step: string) {
    const skipAllowed = ["GOALS"]; // only non-critical steps can be skipped
    if (!skipAllowed.includes(step)) {
      throw new AppError(`Step "${step}" cannot be skipped`, 400, "STEP_NOT_SKIPPABLE");
    }

    const currentIndex = STEP_ORDER.indexOf(step as Step);
    const nextStep     = STEP_ORDER[currentIndex + 1];

    await prisma.user.update({
      where: { id: userId },
      data:  { onboardingStep: nextStep },
    });

    return { success: true, nextStep };
  }
}

export const onboardingService = new OnboardingService();
