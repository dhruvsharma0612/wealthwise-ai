import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authService } from "./auth.service";

const signupSchema = z.object({
  email:     z.string().email(),
  password:  z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1),
  lastName:  z.string().min(1),
  currency:  z.string().length(3, "Currency must be 3 characters e.g. USD"),
  country:   z.string().optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const input = signupSchema.parse(req.body);
      const result = await authService.signup(input);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z
        .object({ refreshToken: z.string().min(1) })
        .parse(req.body);
      const result = await authService.refresh(refreshToken);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z
        .object({ refreshToken: z.string().min(1) })
        .parse(req.body);
      await authService.logout(refreshToken);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
