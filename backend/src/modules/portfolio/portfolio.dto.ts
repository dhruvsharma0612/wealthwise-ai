import { z } from "zod";

const assetType = z.enum([
  "STOCK", "ETF", "CRYPTO", "MUTUAL_FUND", "BOND",
  "REAL_ESTATE", "CASH", "GOLD", "PPF", "NPS", "FD", "OTHER",
]);

// ─── Add / Replace an asset ───────────────────────────────────────────────────

export const upsertAssetSchema = z.object({
  symbol:      z.string().min(1).max(20).toUpperCase(),
  name:        z.string().min(1).max(100),
  type:        assetType,
  quantity:    z.number().positive("Quantity must be positive"),
  avgBuyPrice: z.number().positive("Average buy price must be positive"),
  notes:       z.string().max(500).optional(),
});

export type UpsertAssetDto = z.infer<typeof upsertAssetSchema>;

// ─── Partial update ───────────────────────────────────────────────────────────

export const updateAssetSchema = z.object({
  name:        z.string().min(1).max(100).optional(),
  type:        assetType.optional(),
  quantity:    z.number().positive().optional(),
  avgBuyPrice: z.number().positive().optional(),
  notes:       z.string().max(500).nullable().optional(),
}).refine((d) => Object.keys(d).length > 0, { message: "No fields to update" });

export type UpdateAssetDto = z.infer<typeof updateAssetSchema>;
