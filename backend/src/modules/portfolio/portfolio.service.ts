import { Asset, Portfolio } from "@prisma/client";
import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { financialHealthService } from "../financial-health/financial-health.service";
import type { UpsertAssetDto, UpdateAssetDto } from "./portfolio.dto";

// ─── Serializers ──────────────────────────────────────────────────────────────

function serializeAsset(a: Asset) {
  const quantity    = Number(a.quantity);
  const avgBuyPrice = Number(a.avgBuyPrice);
  return {
    id:          a.id,
    portfolioId: a.portfolioId,
    symbol:      a.symbol,
    name:        a.name,
    type:        a.type,
    quantity,
    avgBuyPrice,
    currentValue: quantity * avgBuyPrice,   // cost-basis value until live prices arrive
    currency:    a.currency,
    notes:       a.notes,
    createdAt:   a.createdAt,
    updatedAt:   a.updatedAt,
  };
}

function buildAllocation(assets: Asset[]) {
  const byType: Record<string, number> = {};
  let total = 0;

  for (const a of assets) {
    const value = Number(a.quantity) * Number(a.avgBuyPrice);
    byType[a.type] = (byType[a.type] ?? 0) + value;
    total += value;
  }

  return {
    totalValue: total,
    byType: Object.entries(byType).map(([type, value]) => ({
      type,
      value,
      allocation: total > 0 ? Math.round((value / total) * 10000) / 100 : 0,
    })).sort((a, b) => b.value - a.value),
    assetCount: assets.length,
    diversificationScore: Math.min(10, Object.keys(byType).length),   // 1 pt per asset class, max 10
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class PortfolioService {

  // ── Portfolio ──────────────────────────────────────────────────────────────

  async getPortfolio(userId: string) {
    const portfolio = await this.findDefault(userId);
    const assets = await prisma.asset.findMany({
      where:   { portfolioId: portfolio.id },
      orderBy: { type: "asc" },
    });

    return {
      portfolio: {
        id:          portfolio.id,
        name:        portfolio.name,
        description: portfolio.description,
        currency:    portfolio.currency,
        isDefault:   portfolio.isDefault,
      },
      assets:     assets.map(serializeAsset),
      allocation: buildAllocation(assets),
    };
  }

  // ── Assets ─────────────────────────────────────────────────────────────────

  async addAsset(userId: string, dto: UpsertAssetDto) {
    const portfolio = await this.findDefault(userId);

    // If same symbol already exists, merge quantity (average-down/up the price)
    const existing = await prisma.asset.findFirst({
      where: { portfolioId: portfolio.id, symbol: dto.symbol },
    });

    let asset: Asset;
    if (existing) {
      const existingQty   = Number(existing.quantity);
      const existingPrice = Number(existing.avgBuyPrice);
      const newQty        = existingQty + dto.quantity;
      const blendedPrice  = ((existingQty * existingPrice) + (dto.quantity * dto.avgBuyPrice)) / newQty;

      asset = await prisma.asset.update({
        where: { id: existing.id },
        data: {
          quantity:    newQty,
          avgBuyPrice: blendedPrice,
          notes:       dto.notes ?? existing.notes,
        },
      });
    } else {
      asset = await prisma.asset.create({
        data: {
          portfolioId: portfolio.id,
          symbol:      dto.symbol,
          name:        dto.name,
          type:        dto.type,
          quantity:    dto.quantity,
          avgBuyPrice: dto.avgBuyPrice,
          currency:    portfolio.currency,
          notes:       dto.notes,
        },
      });
    }

    await financialHealthService.invalidateCache(userId);
    return serializeAsset(asset);
  }

  async updateAsset(userId: string, assetId: string, dto: UpdateAssetDto) {
    await this.findOwnedAsset(userId, assetId);

    const asset = await prisma.asset.update({
      where: { id: assetId },
      data: {
        ...(dto.name        !== undefined && { name: dto.name }),
        ...(dto.type        !== undefined && { type: dto.type }),
        ...(dto.quantity    !== undefined && { quantity: dto.quantity }),
        ...(dto.avgBuyPrice !== undefined && { avgBuyPrice: dto.avgBuyPrice }),
        ...(dto.notes       !== undefined && { notes: dto.notes }),
      },
    });

    await financialHealthService.invalidateCache(userId);
    return serializeAsset(asset);
  }

  async removeAsset(userId: string, assetId: string) {
    await this.findOwnedAsset(userId, assetId);
    await prisma.asset.delete({ where: { id: assetId } });
    await financialHealthService.invalidateCache(userId);
    return { success: true, deletedId: assetId };
  }

  // ── Allocation analysis ────────────────────────────────────────────────────

  async getAllocation(userId: string) {
    const portfolio = await this.findDefault(userId);
    const assets = await prisma.asset.findMany({ where: { portfolioId: portfolio.id } });
    return {
      currency:   portfolio.currency,
      ...buildAllocation(assets),
    };
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async findDefault(userId: string): Promise<Portfolio> {
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId, isDefault: true },
    });
    if (!portfolio) throw new AppError("Portfolio not found", 404, "PORTFOLIO_NOT_FOUND");
    return portfolio;
  }

  private async findOwnedAsset(userId: string, assetId: string): Promise<Asset> {
    const asset = await prisma.asset.findUnique({
      where:   { id: assetId },
      include: { portfolio: { select: { userId: true } } },
    });
    if (!asset || (asset as any).portfolio.userId !== userId) {
      throw new AppError("Asset not found", 404, "ASSET_NOT_FOUND");
    }
    return asset;
  }
}

export const portfolioService = new PortfolioService();
