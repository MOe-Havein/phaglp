import "server-only";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

const projectRoot = path.resolve(__dirname, "..", "..", "..", "..");
const schemaPath = path.join(projectRoot, "prisma", "schema.prisma");
const dbFileName = "./prisma/dev.db";
const localUrl =
  process.platform === "win32"
    ? `file:${dbFileName.replace(/\\/g, "/")}`
    : `file:${dbFileName}`;

const prismaClientSingleton = () => {
  const remoteUrl = env.DATABASE_URL;
  const isRemote =
    typeof remoteUrl === "string" &&
    (remoteUrl.startsWith("libsql://") ||
      remoteUrl.startsWith("http://") ||
      remoteUrl.startsWith("https://"));

  if (
    isRemote &&
    typeof process !== "undefined" &&
    process.env.NEXT_RUNTIME === "nodejs" &&
    typeof process.env.TURSO_AUTH_TOKEN === "string"
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PrismaLibSql } = require("@prisma/adapter-libsql");
      const adapter = new PrismaLibSql({
        url: remoteUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      return new PrismaClient({
        log:
          env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
        adapter,
      });
    } catch (error) {
      if (env.NODE_ENV !== "test") {
        console.warn(
          "[Prisma] Remote adapter unavailable, falling back to local DB:",
          error,
        );
      }
    }
  }

  try {
    return new PrismaClient({
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: { db: { url: localUrl } },
    });
  } catch (error) {
    if (env.NODE_ENV !== "test") {
      console.error(
        "[Prisma] Local DB instantiation failed, attempting schema push...",
        error,
      );
    }

    attemptLocalRecovery();

    return new PrismaClient({
      log:
        env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: { db: { url: localUrl } },
    });
  }
};

function recoverLocalDatabase(): void {
  let dbPath = path.join(projectRoot, "prisma", "dev.db");
  if (process.platform === "win32") {
    dbPath = dbPath.replace(/\\/g, "/");
  }

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, Buffer.alloc(0));
    console.warn(`[Prisma] Recreated local DB at ${dbPath}`);
  }

  try {
    execSync(
      `npx prisma db push --schema=${schemaPath} --accept-data-loss`,
      { cwd: projectRoot, encoding: "utf8", stdio: "pipe" },
    );
  } catch (pushError) {
    console.error("[Prisma] Local schema push failed:", pushError);
  }
}

function attemptLocalRecovery(): void {
  try {
    recoverLocalDatabase();
  } catch (recoveryError) {
    console.error("[Prisma] Local DB recovery failed:", recoveryError);
  }
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma: PrismaClientSingleton = (() => {
  try {
    return globalForPrisma.prisma ?? prismaClientSingleton();
  } catch (error) {
    console.error("[Prisma initialization failed]", error);
    return undefined as any;
  }
})();

if (env.NODE_ENV !== "production" && prisma) {
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
    return { success: true, data: serializePrisma(result), error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected database error occurred";
    if (env.NODE_ENV === "development") {
      console.error("[Database Error]:", error);
    }
    return { success: false, data: fallbackValue, error: message };
  }
}
