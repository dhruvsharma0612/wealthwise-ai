import { Goal } from "@prisma/client";
import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { financialHealthService } from "../financial-health/financial-health.service";
import type { CreateGoalDto, UpdateGoalDto } from "./goals.dto";

// ─── Response shaping ──────────────────────────────────────────────────────────

// Convert Prisma Decimal fields to numbers and add derived progress metrics.
function serialize(goal: Goal) {
  const targetAmount  = Number(goal.targetAmount);
  const currentAmount = Number(goal.currentAmount);
  const remaining     = Math.max(0, targetAmount - currentAmount);
  const percentComplete = targetAmount > 0
    ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
    : 0;

  let monthsToTarget: number | null = null;
  let onTrack: boolean | null = null;
  const monthlySIP = goal.monthlySIP != null ? Number(goal.monthlySIP) : null;

  if (goal.targetDate) {
    const ms = goal.targetDate.getTime() - Date.now();
    monthsToTarget = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24 * 30)));
    if (monthlySIP && monthsToTarget > 0) {
      onTrack = monthlySIP * monthsToTarget >= remaining;
    }
  }

  return {
    id:            goal.id,
    title:         goal.title,
    description:   goal.description,
    category:      goal.category,
    targetAmount,
    currentAmount,
    currency:      goal.currency,
    targetDate:    goal.targetDate,
    monthlySIP,
    priority:      goal.priority,
    status:        goal.status,
    remaining,
    percentComplete,
    monthsToTarget,
    onTrack,
    createdAt:     goal.createdAt,
    updatedAt:     goal.updatedAt,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class GoalsService {

  async list(userId: string) {
    const goals = await prisma.goal.findMany({
      where:   { userId },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
    return goals.map(serialize);
  }

  async get(userId: string, goalId: string) {
    const goal = await this.findOwned(userId, goalId);
    return serialize(goal);
  }

  async create(userId: string, dto: CreateGoalDto) {
    const user = await prisma.user.findUniqueOrThrow({
      where:  { id: userId },
      select: { currency: true },
    });

    const goal = await prisma.goal.create({
      data: {
        userId,
        title:         dto.title,
        description:   dto.description,
        category:      dto.category,
        targetAmount:  dto.targetAmount,
        currentAmount: dto.currentAmount,
        targetDate:    dto.targetDate ? new Date(dto.targetDate) : null,
        monthlySIP:    dto.monthlySIP,
        priority:      dto.priority,
        currency:      user.currency,
      },
    });

    await financialHealthService.invalidateCache(userId);
    return serialize(goal);
  }

  async update(userId: string, goalId: string, dto: UpdateGoalDto) {
    await this.findOwned(userId, goalId);

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(dto.title        !== undefined && { title: dto.title }),
        ...(dto.description  !== undefined && { description: dto.description }),
        ...(dto.category     !== undefined && { category: dto.category }),
        ...(dto.targetAmount !== undefined && { targetAmount: dto.targetAmount }),
        ...(dto.currentAmount !== undefined && { currentAmount: dto.currentAmount }),
        ...(dto.targetDate   !== undefined && { targetDate: dto.targetDate ? new Date(dto.targetDate) : null }),
        ...(dto.monthlySIP   !== undefined && { monthlySIP: dto.monthlySIP }),
        ...(dto.priority     !== undefined && { priority: dto.priority }),
        ...(dto.status       !== undefined && { status: dto.status }),
      },
    });

    await financialHealthService.invalidateCache(userId);
    return serialize(goal);
  }

  // Add a contribution to currentAmount; auto-completes the goal when funded.
  async contribute(userId: string, goalId: string, amount: number) {
    const existing = await this.findOwned(userId, goalId);

    const newAmount = Number(existing.currentAmount) + amount;
    const reachedTarget = newAmount >= Number(existing.targetAmount);

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: newAmount,
        ...(reachedTarget && existing.status === "ACTIVE" && { status: "COMPLETED" }),
      },
    });

    await financialHealthService.invalidateCache(userId);
    return serialize(goal);
  }

  async remove(userId: string, goalId: string) {
    await this.findOwned(userId, goalId);
    await prisma.goal.delete({ where: { id: goalId } });
    await financialHealthService.invalidateCache(userId);
    return { success: true, deletedId: goalId };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async findOwned(userId: string, goalId: string): Promise<Goal> {
    const goal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal || goal.userId !== userId) {
      throw new AppError("Goal not found", 404, "GOAL_NOT_FOUND");
    }
    return goal;
  }
}

export const goalsService = new GoalsService();
