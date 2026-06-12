import { z } from "zod";

const envSchema = z.object({
  NODE_ENV:            z.enum(["development", "production", "test"]).default("development"),
  PORT:                z.string().default("3000"),
  DATABASE_URL:        z.string().min(1),
  REDIS_URL:           z.string().min(1),
  JWT_ACCESS_SECRET:   z.string().min(32),
  JWT_REFRESH_SECRET:  z.string().min(32),
  JWT_ACCESS_EXPIRES:  z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),
  ANTHROPIC_API_KEY:   z.string().min(1),
  ALPHA_VANTAGE_KEY:   z.string().min(1),
  FRONTEND_URL:        z.string().url(),
  BCRYPT_ROUNDS:       z.string().default("12"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
