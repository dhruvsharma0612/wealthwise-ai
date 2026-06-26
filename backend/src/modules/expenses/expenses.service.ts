import { Expense, ExpenseCategory, Prisma } from "@prisma/client";
import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { financialHealthService } from "../financial-health/financial-health.service";
import { aiContextBundleService } from "../ai-context/ai-context-bundle.service";
import { monthRange } from "../../utils/month";
import type { CreateExpenseDto, UpdateExpenseDto } from "./expenses.dto";

// Tracked cashflow feeds both the health score and the AI context — refresh both.
async function invalidateDerived(userId: string): Promise<void> {
  await Promise.all([
    financialHealthService.invalidateCache(userId),
    aiContextBundleService.invalidate(userId),
  ]);
}

// ─── Response shaping ──────────────────────────────────────────────────────────

function serialize(expense: Expense) {
  return {
    id:          expense.id,
    amount:      Number(expense.amount),
    category:    expense.category,
    description: expense.description,
    date:        expense.date,
    isRecurring: expense.isRecurring,
    currency:    expense.currency,
    createdAt:   expense.createdAt,
    updatedAt:   expense.updatedAt,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class ExpensesService {

  // Returns expense entries (optionally for one month) plus totals by category.
  async list(userId: string, month?: string) {
    const where: Prisma.ExpenseWhereInput = { userId };
    if (month) {
      const { start, end } = monthRange(month);
      where.date = { gte: start, lt: end };
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const items = expenses.map(serialize);
    const total = items.reduce((s, e) => s + e.amount, 0);

    const byCategory: Record<string, number> = {};
    for (const e of items) {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    }

    return { items, total, byCategory, count: items.length };
  }

  // Aggregate spend per category for a month — used by the budget comparison.
  async spentByCategory(userId: string, month: string): Promise<Record<string, number>> {
    const { start, end } = monthRange(month);
    const grouped = await prisma.expense.groupBy({
      by:     ["category"],
      where:  { userId, date: { gte: start, lt: end } },
      _sum:   { amount: true },
    });
    const result: Record<string, number> = {};
    for (const g of grouped) {
      result[g.category] = Number(g._sum.amount ?? 0);
    }
    return result;
  }

  async get(userId: string, expenseId: string) {
    const expense = await this.findOwned(userId, expenseId);
    return serialize(expense);
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const user = await prisma.user.findUniqueOrThrow({
      where:  { id: userId },
      select: { currency: true },
    });

    const expense = await prisma.expense.create({
      data: {
        userId,
        amount:      dto.amount,
        category:    dto.category as ExpenseCategory,
        description: dto.description,
        date:        new Date(dto.date),
        isRecurring: dto.isRecurring,
        currency:    user.currency,
      },
    });

    await invalidateDerived(userId);
    return serialize(expense);
  }

  async update(userId: string, expenseId: string, dto: UpdateExpenseDto) {
    await this.findOwned(userId, expenseId);

    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(dto.amount      !== undefined && { amount: dto.amount }),
        ...(dto.category    !== undefined && { category: dto.category as ExpenseCategory }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.date        !== undefined && { date: new Date(dto.date) }),
        ...(dto.isRecurring !== undefined && { isRecurring: dto.isRecurring }),
      },
    });

    await invalidateDerived(userId);
    return serialize(expense);
  }

  async remove(userId: string, expenseId: string) {
    await this.findOwned(userId, expenseId);
    await prisma.expense.delete({ where: { id: expenseId } });
    await invalidateDerived(userId);
    return { success: true, deletedId: expenseId };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findOwned(userId: string, expenseId: string): Promise<Expense> {
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense || expense.userId !== userId) {
      throw new AppError("Expense not found", 404, "EXPENSE_NOT_FOUND");
    }
    return expense;
  }
}

export const expensesService = new ExpensesService();
