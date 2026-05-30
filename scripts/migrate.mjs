import { execSync } from "child_process"

const MAX_RETRIES = 5
const INITIAL_DELAY_MS = 2000

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function runMigrations() {
  console.log("🏁 Starting production database migration engine...")

  let attempts = 0
  let delay = INITIAL_DELAY_MS

  while (attempts < MAX_RETRIES) {
    try {
      attempts++
      console.log(`📡 [Attempt ${attempts}/${MAX_RETRIES}] Probing database connectivity...`)

      // Step 1: Check if the Prisma schema can reach the database channel safely
      execSync('pnpm exec prisma db execute --stdin "SELECT 1;"', { stdio: "pipe" })
      console.log("✅ Database channel verified. Executing migration payload...")

      // Step 2: Fire the production-safe migration deployment engine
      execSync("pnpm exec prisma migrate deploy", { stdio: "inherit" })
      console.log("🎉 Database migrations applied successfully.")

      process.exit(0)
    } catch (error) {
      console.error(`⚠️ Connection or migration error on attempt ${attempts}:`)
      console.error(error.message || error)

      if (attempts >= MAX_RETRIES) {
        console.error("❌ Max connection retries reached. Migration engine aborted.")
        process.exit(1)
      }

      console.log(`⏱️ Waiting ${delay / 1000}s before next execution window...`)
      await sleep(delay)
      delay *= 2 // Exponential backoff scaling
    }
  }
}

runMigrations()
