import { createClient } from "@libsql/client";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

async function main() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error(
      "Error: TURSO_DATABASE_URL or DATABASE_URL is not defined in env",
    );
    process.exit(1);
  }

  console.log(`Connecting to Turso database at: ${url}`);

  const client = createClient({
    url: url,
    authToken: token,
  });

  try {
    console.log("Creating FoxyTransaction table...");

    await client.execute(`
      CREATE TABLE IF NOT EXISTS "FoxyTransaction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "foxyId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "totalOrder" REAL NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'USD',
        "status" TEXT NOT NULL,
        "itemsJson" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FoxyTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log("Creating indexes for FoxyTransaction...");

    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "FoxyTransaction_foxyId_key" ON "FoxyTransaction"("foxyId");
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS "FoxyTransaction_userId_idx" ON "FoxyTransaction"("userId");
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS "FoxyTransaction_foxyId_idx" ON "FoxyTransaction"("foxyId");
    `);

    console.log(
      "✓ FoxyTransaction table and indexes created successfully on Turso!",
    );
  } catch (error) {
    console.error("✗ Failed to execute SQL on Turso:", error);
  } finally {
    client.close();
  }
}

main().catch(console.error);
