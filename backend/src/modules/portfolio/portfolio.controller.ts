import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import { portfolioService } from "./portfolio.service";
import { upsertAssetSchema, updateAssetSchema } from "./portfolio.dto";

class PortfolioController {

  async getPortfolio(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await portfolioService.getPortfolio(req.user!.id);
      res.json(data);
    } catch (err) { next(err); }
  }

  async getAllocation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await portfolioService.getAllocation(req.user!.id);
      res.json(data);
    } catch (err) { next(err); }
  }

  async addAsset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto   = upsertAssetSchema.parse(req.body);
      const asset = await portfolioService.addAsset(req.user!.id, dto);
      res.status(201).json(asset);
    } catch (err) { next(err); }
  }

  async updateAsset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dto   = updateAssetSchema.parse(req.body);
      const asset = await portfolioService.updateAsset(req.user!.id, req.params.assetId, dto);
      res.json(asset);
    } catch (err) { next(err); }
  }

  async removeAsset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await portfolioService.removeAsset(req.user!.id, req.params.assetId);
      res.json(result);
    } catch (err) { next(err); }
  }
}

export const portfolioController = new PortfolioController();
