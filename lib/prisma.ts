import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { env } from "@/lib/env";

declare global {
  var __udgamPrisma: PrismaClient | undefined;
  var __udgamPgPool: Pool | undefined;
}

function createPrismaClient() {
  const pool =
    globalThis.__udgamPgPool ??
    new Pool({
      connectionString: process.env.DATABASE_URL,
    });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__udgamPgPool = pool;
  }

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

export const prisma = env.hasDatabase
  ? globalThis.__udgamPrisma ?? createPrismaClient()
  : null;

if (env.hasDatabase && process.env.NODE_ENV !== "production") {
  globalThis.__udgamPrisma = prisma ?? undefined;
}
