import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { env } from "@/env";

const prismaClientSingleton = () => {
  const url = env.DATABASE_URL;
  const isRemote =
    url.startsWith("libsql://") ||
    url.startsWith("http://") ||
    url.startsWith("https://");

  const config: { url: string; authToken?: string } = { url };
  if (isRemote && process.env.TURSO_AUTH_TOKEN) {
    config.authToken = process.env.TURSO_AUTH_TOKEN;
  }

  if (isRemote) {
    const adapter = new PrismaLibSql(config);
    return new PrismaClient({
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      adapter,
    });
  }

  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: { url },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

export function serializePrisma<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
}

export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T | null = null,
): Promise<{ success: boolean; data: T | null; error: string | null }> {
  try {
    const result = await queryFn();
    return {
      success: true,
      data: serializePrisma(result),
      error: null,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected database error occurred";
    if (env.NODE_ENV === "development") {
      console.error("[Database Error]:", error);
    }
    return {
      success: false,
      data: fallbackValue,
      error: message,
    };
  }
}
