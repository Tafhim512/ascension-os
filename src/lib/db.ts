import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const provider = process.env.DATABASE_PROVIDER || "sqlite";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const prisma = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const isProduction = provider === "postgresql" || process.env.NODE_ENV === "production";

  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  if (!isProduction) globalForPrisma.prisma = client;
  return client;
})();
