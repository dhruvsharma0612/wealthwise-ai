import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/auth";

export const authRouter = Router();

// Public routes
authRouter.post("/signup",  authController.signup.bind(authController));
authRouter.post("/login",   authController.login.bind(authController));
authRouter.post("/refresh", authController.refresh.bind(authController));
authRouter.post("/logout",  authController.logout.bind(authController));

// Protected routes
authRouter.get("/me", authenticate, authController.me.bind(authController));
