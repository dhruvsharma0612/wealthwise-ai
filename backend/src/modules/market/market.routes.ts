import { Router, Response, NextFunction } from "express";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { marketService } from "./market.service";

export const marketRouter = Router();

// All market routes require authentication
marketRouter.use(authenticate);

// GET /api/market/quote/:symbol
marketRouter.get(
  "/quote/:symbol",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { symbol } = req.params;
      const plan       = req.user?.plan || "FREE";
      const result     = await marketService.getQuote(symbol, plan);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/market/search?q=apple
marketRouter.get(
  "/search",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const query  = req.query.q as string;
      if (!query) {
        res.status(400).json({ error: "Query parameter q is required" });
        return;
      }
      const result = await marketService.searchSymbol(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/market/fx?from=USD&to=EUR
marketRouter.get(
  "/fx",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const from = req.query.from as string;
      const to   = req.query.to   as string;
      if (!from || !to) {
        res.status(400).json({ error: "from and to query params are required" });
        return;
      }
      const result = await marketService.getExchangeRate(from, to);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/market/movers
marketRouter.get(
  "/movers",
  async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await marketService.getTopMovers();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);
