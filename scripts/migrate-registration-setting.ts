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
    console.log(
      "Checking if allowRegistration column exists in SiteSettings...",
    );
    const tableInfo = await client.execute(
      `PRAGMA table_info("SiteSettings");`,
    );
    const hasCol = tableInfo.rows.some(
      (row) => row.name === "allowRegistration",
    );

    if (!hasCol) {
      console.log("Adding allowRegistration column to SiteSettings...");
      await client.execute(`
        ALTER TABLE "SiteSettings" ADD COLUMN "allowRegistration" BOOLEAN NOT NULL DEFAULT 1;
      `);
      console.log(
        "✓ allowRegistration column successfully added to Turso SiteSettings table!",
      );
    } else {
      console.log(
        "✓ allowRegistration column already exists in Turso SiteSettings table.",
      );
    }
  } catch (error) {
    console.error("✗ Failed to execute column addition SQL on Turso:", error);
  } finally {
    client.close();
  }
}

main().catch(console.error);
