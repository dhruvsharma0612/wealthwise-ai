import { Budget, ExpenseCategory } from "@prisma/client";
import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { expensesService } from "../expenses/expenses.service";
import { currentMonth } from "../../utils/month";
import type { SetBudgetDto } from "./budgets.dto";

// ─── Service ──────────────────────────────────────────────────────────────────

export class BudgetsService {

  // Budgets for a month, each enriched with actual spend, remaining and status.
  async getForMonth(userId: string, month?: string) {
    const m = month ?? currentMonth();

    const [budgets, spentByCategory] = await Promise.all([
      prisma.budget.findMany({ where: { userId, month: m }, orderBy: { category: "asc" } }),
      expensesService.spentByCategory(userId, m),
    ]);

    const items = budgets.map((b: Budget) => {
      const amount    = Number(b.amount);
      const spent     = spentByCategory[b.category] ?? 0;
      const remaining = amount - spent;
      const percentUsed = amount > 0 ? Math.round((spent / amount) * 100) : 0;
      const status = spent > amount ? "over" : percentUsed >= 80 ? "warning" : "ok";
      return {
        id:       b.id,
        month:    b.month,
        category: b.category,
        amount,
        spent,
        remaining,
        percentUsed,
        status,
        currency: b.currency,
      };
    });

    const totalBudget = items.reduce((s, i) => s + i.amount, 0);
    const totalSpent  = items.reduce((s, i) => s + i.spent, 0);

    // Spend in categories with no budget set — surfaced so nothing is hidden.
    const budgetedCategories = new Set(items.map((i) => i.category));
    const unbudgeted: Record<string, number> = {};
    for (const [cat, spent] of Object.entries(spentByCategory)) {
      if (!budgetedCategories.has(cat as ExpenseCategory)) unbudgeted[cat] = spent;
    }

    return {
      month: m,
      items,
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      unbudgeted,
    };
  }

  // Create or update the budget for a (month, category) pair.
  async set(userId: string, dto: SetBudgetDto) {
    const user = await prisma.user.findUniqueOrThrow({
      where:  { id: userId },
      select: { currency: true },
    });

    const budget = await prisma.budget.upsert({
      where: {
        userId_month_category: {
          userId,
          month:    dto.month,
          category: dto.category as ExpenseCategory,
        },
      },
      create: {
        userId,
        month:    dto.month,
        category: dto.category as ExpenseCategory,
        amount:   dto.amount,
        currency: user.currency,
      },
      update: { amount: dto.amount },
    });

    return {
      id:       budget.id,
      month:    budget.month,
      category: budget.category,
      amount:   Number(budget.amount),
      currency: budget.currency,
    };
  }

  async remove(userId: string, budgetId: string) {
    const budget = await prisma.budget.findUnique({ where: { id: budgetId } });
    if (!budget || budget.userId !== userId) {
      throw new AppError("Budget not found", 404, "BUDGET_NOT_FOUND");
    }
    await prisma.budget.delete({ where: { id: budgetId } });
    return { success: true, deletedId: budgetId };
  }
}

export const budgetsService = new BudgetsService();
