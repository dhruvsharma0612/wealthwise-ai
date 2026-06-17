import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

// Prisma v5 narrows $on() to `never` unless log levels are inlined as a
// const-asserted tuple. We use (prisma as any) on the $on call to avoid the
// type conflict while keeping full runtime behaviour.
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "production"
      ? [{ emit: "stdout", level: "error" }]
      : [
          { emit: "event",  level: "query" },
          { emit: "stdout", level: "error" },
          { emit: "stdout", level: "warn"  },
        ],
});

if (process.env.NODE_ENV !== "production") {
  (prisma as any).$on("query", (e: { duration: number; query: string }) => {
    if (e.duration > 1000) {
      logger.warn(`Slow query (${e.duration}ms): ${e.query.slice(0, 120)}`);
    }
  });
}
