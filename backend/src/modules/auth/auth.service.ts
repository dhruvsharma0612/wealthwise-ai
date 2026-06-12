import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../../services/prisma";
import { AppError } from "../../middleware/errorHandler";
import { logger } from "../../services/logger";

interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  currency: string;
  country?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  private generateAccessToken(payload: {
    id: string;
    email: string;
    plan: string;
  }) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
    });
  }

  private generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  async signup(input: SignupInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw new AppError("Email already registered", 409, "EMAIL_EXISTS");
    }

    const passwordHash = await bcrypt.hash(
      input.password,
      parseInt(process.env.BCRYPT_ROUNDS || "12")
    );

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email:        input.email.toLowerCase(),
          passwordHash,
          firstName:    input.firstName,
          lastName:     input.lastName,
          currency:     input.currency,
          country:      input.country,
        },
      });

      await tx.portfolio.create({
        data: {
          userId:    newUser.id,
          name:      "My Portfolio",
          currency:  input.currency,
          isDefault: true,
        },
      });

      return newUser;
    });

    logger.info("New user registered", {
      userId: user.id,
      email:  user.email,
    });

    const accessToken  = this.generateAccessToken({
      id:    user.id,
      email: user.email,
      plan:  user.plan,
    });
    const refreshToken = this.generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id:        user.id,
        email:     user.email,
        firstName: user.firstName,
        lastName:  user.lastName,
        plan:      user.plan,
        currency:  user.currency,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    const passwordMatch = user
      ? await bcrypt.compare(input.password, user.passwordHash)
      : await bcrypt.compare(
          input.password,
          "$2a$12$dummy.hash.to.prevent.timing"
        );

    if (!user || !passwordMatch) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS"
      );
    }

    if (!user.isActive) {
      throw new AppError(
        "Account deactivated",
        403,
        "ACCOUNT_DEACTIVATED"
      );
    }

    const accessToken  = this.generateAccessToken({
      id:    user.id,
      email: user.email,
      plan:  user.plan,
    });
    const refreshToken = this.generateRefreshToken();

    await prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info("User logged in", { userId: user.id });

    return {
      user: {
        id:        user.id,
        email:     user.email,
        firstName: user.firstName,
        lastName:  user.lastName,
        plan:      user.plan,
        currency:  user.currency,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where:   { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new AppError(
        "Invalid or expired refresh token",
        401,
        "INVALID_REFRESH_TOKEN"
      );
    }

    const newRefreshToken = this.generateRefreshToken();

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: stored.id },
        data:  { isRevoked: true },
      }),
      prisma.refreshToken.create({
        data: {
          token:     newRefreshToken,
          userId:    stored.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const accessToken = this.generateAccessToken({
      id:    stored.user.id,
      email: stored.user.email,
      plan:  stored.user.plan,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data:  { isRevoked: true },
    });
  }
}

export const authService = new AuthService();
