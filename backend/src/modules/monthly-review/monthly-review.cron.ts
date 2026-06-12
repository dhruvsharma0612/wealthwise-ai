// ─── Monthly Review Cron Job ──────────────────────────────────────────────────
// Runs on the 1st of each month at 9:00 AM IST for premium users.
// For a production setup, use a proper job queue (Bull/BullMQ) instead.
// This is a lightweight Node.js setInterval-based approach for MVP.

import { prisma } from "../../services/prisma";
import { monthlyReviewService } from "./monthly-review.service";
import { logger } from "../../services/logger";

function getPreviousMonth(): string {
  const now  = new Date();
  const d    = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

async function runMonthlyReviewsForPremiumUsers(): Promise<void> {
  const month = getPreviousMonth();
  logger.info(`Monthly review cron started for ${month}`);

  // Only for users who have completed onboarding and are on PRO+ plans
  const eligibleUsers = await prisma.user.findMany({
    where: {
      onboardingCompleted: true,
      isActive:            true,
      plan:                { in: ["PRO", "PREMIUM", "ELITE"] },
    },
    select: { id: true, firstName: true, monthlyIncome: true, monthlyExpenses: true },
  });

  logger.info(`Found ${eligibleUsers.length} eligible users for monthly review`);

  let success = 0;
  let failed  = 0;

  for (const user of eligibleUsers) {
    try {
      // Check if review already generated this month
      const existing = await prisma.monthlyReview.findUnique({
        where: { userId_month: { userId: user.id, month } },
      });
      if (existing) continue;

      const income   = Number(user.monthlyIncome   ?? 0);
      const expenses = Number(user.monthlyExpenses ?? 0);
      if (income === 0) continue;

      // Use profile estimates for auto-generation (user can refine later)
      await monthlyReviewService.generate(user.id, {
        month,
        incomeReceived: income,
        totalSpent:     expenses,
        totalInvested:  0, // user can update
      });

      success++;
      // Respectful rate limit: 2 per second to avoid Claude API throttling
      await new Promise((r) => setTimeout(r, 500));

    } catch (err) {
      failed++;
      logger.error("Monthly review failed for user", { userId: user.id, err });
    }
  }

  logger.info(`Monthly review cron completed: ${success} generated, ${failed} failed`);
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function startMonthlyReviewCron(): void {
  // Check every hour — run review job on 1st of month around 09:00 IST (03:30 UTC)
  const INTERVAL_MS = 60 * 60 * 1000; // 1 hour

  const tick = async () => {
    const now   = new Date();
    const isIST = now.getUTCHours() === 3 && now.getUTCMinutes() < 60; // 03:xx UTC = 09:xx IST
    const isFirst = now.getUTCDate() === 1;

    if (isFirst && isIST) {
      await runMonthlyReviewsForPremiumUsers();
    }
  };

  setInterval(tick, INTERVAL_MS);
  logger.info("Monthly review cron scheduler started");
}

// For manual trigger in development
export { runMonthlyReviewsForPremiumUsers };
