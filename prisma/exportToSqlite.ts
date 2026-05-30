import { Client } from "pg"
import { DatabaseSync } from "node:sqlite" // 👈 Built directly into Node.js!
import path from "path"

// Your direct Neon Postgres URL
const NEON_URL =
  "postgresql://neondb_owner:npg_I76xRjGDcAaL@ep-crimson-shadow-aiz14lvg-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"

async function main() {
  const dbPath = path.join(__dirname, "dev.db")

  // 1. Initialize local SQLite Database file using native Node APIs
  // Do NOT delete the database so we preserve other tables created by Prisma!
  const sqliteDb = new DatabaseSync(dbPath)
  console.log(`📁 Target File Connected: ${dbPath}`)

  // 2. Setup the User table locally in SQLite only if it doesn't exist
  // (Usually, Prisma db push handles this, but we keep a fallback)
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "name" TEXT,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'USER',
      "lecturePreferences" TEXT NOT NULL DEFAULT '{}',
      "createdAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "tier" TEXT NOT NULL DEFAULT 'BASIC'
    );
  `)
  console.log("🔨 SQLite table structure verified.")

  // 3. Connect to Neon PostgreSQL using native pg client
  const pgClient = new Client({ connectionString: NEON_URL })

  try {
    console.log("📡 Connecting to remote Neon instance...")
    await pgClient.connect()

    console.log('📥 Fetching row data from remote "User" table...')
    const result = await pgClient.query('SELECT * FROM "User"')
    const remoteUsers = result.rows

    if (remoteUsers.length === 0) {
      console.log("⚠️ No records found in your remote User table.")
      return
    }

    // 4. Prepare local SQLite insertion query with upsert capability
    const insertUser = sqliteDb.prepare(`
      INSERT INTO "User" (id, email, name, passwordHash, role, lecturePreferences, createdAt, updatedAt, tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email=excluded.email,
        name=excluded.name,
        passwordHash=excluded.passwordHash,
        role=excluded.role,
        lecturePreferences=excluded.lecturePreferences,
        updatedAt=excluded.updatedAt;
    `)

    // 5. Batch insert the records
    console.log(`💾 Writing ${remoteUsers.length} records into local SQLite...`)

    // Begin immediate transaction manually
    sqliteDb.exec("BEGIN TRANSACTION;")

    for (const row of remoteUsers) {
      const nowStr = new Date().toISOString()
      insertUser.run(
        String(row.id),
        row.email,
        row.name || null,
        row.passwordHash || row.password_hash || "",
        row.role || "USER",
        row.lecturePreferences ? JSON.stringify(row.lecturePreferences) : "{}",
        row.createdAt ? new Date(row.createdAt).toISOString() : nowStr,
        row.updatedAt ? new Date(row.updatedAt).toISOString() : nowStr,
        row.tier || "BASIC",
      )
    }

    sqliteDb.exec("COMMIT;")
    console.log(`\n✅ Success! Exported data into prisma/dev.db.`)
  } catch (err) {
    // Rollback transaction if anything fails mid-stream
    try {
      sqliteDb.exec("ROLLBACK;")
    } catch (_) {}
    console.error("❌ Data extraction failed:", err)
  } finally {
    sqliteDb.close()
    await pgClient.end()
  }
}

main()
