import { execSync } from "child_process"

// Delete deprecated pnpm env vars that cause npx/npm warnings
delete process.env["npm-globalconfig"]
delete process.env["verify-deps-before-run"]
delete process.env["_jsr-registry"]

console.log("Starting database migration process...")

// Helper to run commands and ignore errors (useful for baselining already-resolved migrations)
function tryResolve(migrationName) {
  try {
    console.log(`Attempting to baseline: ${migrationName}...`)
    execSync(`npx prisma migrate resolve --applied ${migrationName}`, { stdio: "inherit" })
  } catch (error) {
    console.log(`Baseline for ${migrationName} skipped (likely already applied).`)
  }
}

// Helper to resolve failed migrations so they can be retried
function tryRollback(migrationName) {
  try {
    console.log(`Attempting to mark as rolled back: ${migrationName}...`)
    execSync(`npx prisma migrate resolve --rolled-back ${migrationName}`, { stdio: "inherit" })
  } catch (error) {
    console.log(`Rollback marker for ${migrationName} skipped (likely not failed).`)
  }
}

// 1. Baseline the initial db push migrations so a non-empty DB doesn't throw P3005
tryResolve("20260213125334_init_with_embeddings")
tryResolve("20260213160704_add_article_cover_and_featured")

// 1.5. Rollback the failed migration so it can be retried
tryRollback("20260317142305_code_quality_fixes")

// 2. Deploy all pending migrations
try {
  console.log("Deploying pending migrations...")
  execSync("npx prisma migrate deploy", { stdio: "inherit" })
  console.log("Database migration complete.")
} catch (error) {
  console.error("Migration failed.")
  process.exit(1)
}
