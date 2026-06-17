import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { portfolioController as ctrl } from "./portfolio.controller";

export const portfolioRouter = Router();

portfolioRouter.use(authenticate);

// GET   /api/portfolio              — full portfolio + assets + allocation
// GET   /api/portfolio/allocation   — allocation breakdown only
// POST  /api/portfolio/assets       — add asset (merges if symbol exists)
// PATCH /api/portfolio/assets/:id   — update quantity / price / type
// DELETE /api/portfolio/assets/:id  — remove asset

portfolioRouter.get("/",                    ctrl.getPortfolio.bind(ctrl));
portfolioRouter.get("/allocation",          ctrl.getAllocation.bind(ctrl));
portfolioRouter.post("/assets",             ctrl.addAsset.bind(ctrl));
portfolioRouter.patch("/assets/:assetId",   ctrl.updateAsset.bind(ctrl));
portfolioRouter.delete("/assets/:assetId",  ctrl.removeAsset.bind(ctrl));
