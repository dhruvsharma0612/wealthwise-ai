import Redis from "ioredis";
import { logger } from "./logger";

export const redis = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 10) {
      logger.error("Redis: max retries reached, giving up");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect",      () => logger.info("Redis connected"));
redis.on("error",   (err) => logger.error("Redis error", { err }));
redis.on("reconnecting", () => logger.warn("Redis reconnecting..."));

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async increment(key: string): Promise<number> {
    return redis.incr(key);
  },

  async getAiQueryCount(userId: string): Promise<number> {
    const key = `ai:queries:${userId}:${new Date().toISOString().slice(0, 10)}`;
    const count = await redis.get(key);
    return count ? parseInt(count) : 0;
  },

  async incrementAiQueryCount(userId: string): Promise<number> {
    const key = `ai:queries:${userId}:${new Date().toISOString().slice(0, 10)}`;
    const count = await redis.incr(key);
    if (count === 1) {
      const secondsUntilMidnight = 86400 - (Date.now() / 1000 % 86400);
      await redis.expire(key, Math.floor(secondsUntilMidnight));
    }
    return count;
  },
};
