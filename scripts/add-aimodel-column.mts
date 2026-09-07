// One-off: add the aiModel column to the remote Turso (libSQL) database.
// Equivalent to `prisma db push` for this single additive, nullable column.
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("DATABASE_URL and TURSO_AUTH_TOKEN must be set");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  // Guard against running twice.
  const check = await client.execute(
    `SELECT COUNT(*) AS c FROM pragma_table_info('User') WHERE name = 'aiModel'`,
  );
  const exists = Number((check.rows[0] as any).c) > 0;
  if (exists) {
    console.log("Column aiModel already exists — skipping.");
    return;
  }

  await client.execute(
    `ALTER TABLE "User" ADD COLUMN "aiModel" TEXT NOT NULL DEFAULT 'cohere-command-a-reasoning'`,
  );
  console.log("Added aiModel column to User table.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Failed to apply migration:", e);
    process.exit(1);
  });
