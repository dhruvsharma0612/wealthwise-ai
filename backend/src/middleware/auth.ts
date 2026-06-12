import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../services/prisma";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    plan: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as {
      id: string;
      email: string;
      plan: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, plan: true, isActive: true },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: "Account not found or deactivated" });
      return;
    }

    req.user = { id: user.id, email: user.email, plan: user.plan };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
      return;
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requirePlan = (requiredPlan: "PREMIUM") => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.plan !== requiredPlan) {
      res.status(403).json({
        error: "This feature requires a Premium plan",
        code: "UPGRADE_REQUIRED",
        upgradeUrl: "/pricing",
      });
      return;
    }
    next();
  };
};
