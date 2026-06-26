import { prisma } from "../../services/prisma";

// Real monthly cashflow derived from tracked Income / Expense entries.
// Used to enrich the financial-health score and AI context with actuals
// instead of the static onboarding aggregates on the User record.

export interface CashflowActuals {
  hasData:         boolean; // any tracked income or expense in the window
  monthlyIncome:   number;  // averaged over months that contain data
  monthlyExpenses: number;
  monthlySavings:  number;
  monthsCounted:   number;
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export class CashflowService {

  // Average monthly income/expenses over the trailing `months` calendar months
  // (default 3). Averaging by the number of months that actually contain data
  // keeps figures meaningful for users who have only started tracking.
  async actuals(userId: string, months = 3): Promise<CashflowActuals> {
    const now   = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (months - 1), 1));
    const end   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({
        where:  { userId, date: { gte: start, lt: end } },
        select: { amount: true, date: true },
      }),
      prisma.expense.findMany({
        where:  { userId, date: { gte: start, lt: end } },
        select: { amount: true, date: true },
      }),
    ]);

    const hasData = incomes.length > 0 || expenses.length > 0;
    if (!hasData) {
      return { hasData: false, monthlyIncome: 0, monthlyExpenses: 0, monthlySavings: 0, monthsCounted: 0 };
    }

    const monthsWithData = new Set<string>();
    let totalIncome = 0;
    let totalExpenses = 0;
    for (const i of incomes) { totalIncome   += Number(i.amount); monthsWithData.add(monthKey(i.date)); }
    for (const e of expenses) { totalExpenses += Number(e.amount); monthsWithData.add(monthKey(e.date)); }

    const monthsCounted   = Math.max(1, monthsWithData.size);
    const monthlyIncome   = totalIncome   / monthsCounted;
    const monthlyExpenses = totalExpenses / monthsCounted;

    return {
      hasData:        true,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings: monthlyIncome - monthlyExpenses,
      monthsCounted,
    };
  }
}

export const cashflowService = new CashflowService();
