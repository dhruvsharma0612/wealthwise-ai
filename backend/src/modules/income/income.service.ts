import { Income, IncomeCategory, Prisma } from "@prisma/client";
import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { financialHealthService } from "../financial-health/financial-health.service";
import { aiContextBundleService } from "../ai-context/ai-context-bundle.service";
import { monthRange } from "../../utils/month";
import type { CreateIncomeDto, UpdateIncomeDto } from "./income.dto";

// Tracked cashflow feeds both the health score and the AI context — refresh both.
async function invalidateDerived(userId: string): Promise<void> {
  await Promise.all([
    financialHealthService.invalidateCache(userId),
    aiContextBundleService.invalidate(userId),
  ]);
}

// ─── Response shaping ──────────────────────────────────────────────────────────

function serialize(income: Income) {
  return {
    id:          income.id,
    amount:      Number(income.amount),
    category:    income.category,
    source:      income.source,
    description: income.description,
    date:        income.date,
    isRecurring: income.isRecurring,
    currency:    income.currency,
    createdAt:   income.createdAt,
    updatedAt:   income.updatedAt,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class IncomeService {

  // Returns income entries (optionally for one month) plus totals by category.
  async list(userId: string, month?: string) {
    const where: Prisma.IncomeWhereInput = { userId };
    if (month) {
      const { start, end } = monthRange(month);
      where.date = { gte: start, lt: end };
    }

    const incomes = await prisma.income.findMany({
      where,
      orderBy: { date: "desc" },
    });

    const items = incomes.map(serialize);
    const total = items.reduce((s, i) => s + i.amount, 0);

    const byCategory: Record<string, number> = {};
    for (const i of items) {
      byCategory[i.category] = (byCategory[i.category] ?? 0) + i.amount;
    }

    return { items, total, byCategory, count: items.length };
  }

  async get(userId: string, incomeId: string) {
    const income = await this.findOwned(userId, incomeId);
    return serialize(income);
  }

  async create(userId: string, dto: CreateIncomeDto) {
    const user = await prisma.user.findUniqueOrThrow({
      where:  { id: userId },
      select: { currency: true },
    });

    const income = await prisma.income.create({
      data: {
        userId,
        amount:      dto.amount,
        category:    dto.category as IncomeCategory,
        source:      dto.source,
        description: dto.description,
        date:        new Date(dto.date),
        isRecurring: dto.isRecurring,
        currency:    user.currency,
      },
    });

    await invalidateDerived(userId);
    return serialize(income);
  }

  async update(userId: string, incomeId: string, dto: UpdateIncomeDto) {
    await this.findOwned(userId, incomeId);

    const income = await prisma.income.update({
      where: { id: incomeId },
      data: {
        ...(dto.amount      !== undefined && { amount: dto.amount }),
        ...(dto.category    !== undefined && { category: dto.category as IncomeCategory }),
        ...(dto.source      !== undefined && { source: dto.source }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.date        !== undefined && { date: new Date(dto.date) }),
        ...(dto.isRecurring !== undefined && { isRecurring: dto.isRecurring }),
      },
    });

    await invalidateDerived(userId);
    return serialize(income);
  }

  async remove(userId: string, incomeId: string) {
    await this.findOwned(userId, incomeId);
    await prisma.income.delete({ where: { id: incomeId } });
    await invalidateDerived(userId);
    return { success: true, deletedId: incomeId };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findOwned(userId: string, incomeId: string): Promise<Income> {
    const income = await prisma.income.findUnique({ where: { id: incomeId } });
    if (!income || income.userId !== userId) {
      throw new AppError("Income not found", 404, "INCOME_NOT_FOUND");
    }
    return income;
  }
}

export const incomeService = new IncomeService();
