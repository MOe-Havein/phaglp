import { createClient } from "@libsql/client"
import dotenv from "dotenv"

// Load env variables
dotenv.config()

async function main() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL
  const token = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    console.error("Error: TURSO_DATABASE_URL or DATABASE_URL is not defined in env")
    process.exit(1)
  }

  console.log(`Connecting to Turso database at: ${url}`)
  
  const client = createClient({
    url: url,
    authToken: token,
  })

  try {
    console.log("Dropping existing Post table (if any)...")
    await client.execute(`DROP TABLE IF EXISTS "Post";`)
    
    console.log("Creating new Post table with rich publication columns...")
    await client.execute(`
      CREATE TABLE "Post" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "slug" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "body" TEXT NOT NULL,
        "excerpt" TEXT,
        "category" TEXT NOT NULL,
        "tags" TEXT NOT NULL,
        "published" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "readingTime" INTEGER,
        "coverImage" TEXT,
        "isFeatured" BOOLEAN NOT NULL DEFAULT 0,
        "authorId" TEXT NOT NULL,
        CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)
    
    console.log("Creating indexes for Post table...")
    await client.execute(`CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");`)
    await client.execute(`CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");`)
    
    console.log("✓ Post table recreated successfully on Turso with full schema alignment!")
  } catch (error) {
    console.error("✗ Failed to execute Post migration SQL on Turso:", error)
  } finally {
    client.close()
  }
}

main().catch(console.error)
