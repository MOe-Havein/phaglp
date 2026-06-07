import { createClient } from "@libsql/client";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

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
    console.log("Creating Certificate table on Turso...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Certificate" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        "certificateCode" TEXT NOT NULL,
        "grade" TEXT NOT NULL DEFAULT 'Completed',
        "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await client.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_certificateCode_key" ON "Certificate"("certificateCode");`,
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS "Certificate_userId_idx" ON "Certificate"("userId");`,
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS "Certificate_courseId_idx" ON "Certificate"("courseId");`,
    );
    console.log("✓ Certificate table verified/created successfully!");

    console.log("Creating LessonProgress table on Turso...");
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "LessonProgress" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "lessonId" TEXT NOT NULL,
        "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await client.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");`,
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS "LessonProgress_userId_idx" ON "LessonProgress"("userId");`,
    );
    await client.execute(
      `CREATE INDEX IF NOT EXISTS "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");`,
    );
    console.log("✓ LessonProgress table verified/created successfully!");
  } catch (error) {
    console.error("✗ Failed to execute migration SQL on Turso:", error);
  } finally {
    client.close();
  }

  // Also apply to local SQLite dev.db if it exists
  const localDbPath = path.join(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(localDbPath)) {
    console.log(
      `\nFound local SQLite database at: ${localDbPath}. Applying tables...`,
    );
    const localClient = createClient({
      url: `file:${localDbPath}`,
    });
    try {
      await localClient.execute(`
        CREATE TABLE IF NOT EXISTS "Certificate" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "courseId" TEXT NOT NULL,
          "certificateCode" TEXT NOT NULL,
          "grade" TEXT NOT NULL DEFAULT 'Completed',
          "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
      await localClient.execute(
        `CREATE UNIQUE INDEX IF NOT EXISTS "Certificate_certificateCode_key" ON "Certificate"("certificateCode");`,
      );
      await localClient.execute(
        `CREATE INDEX IF NOT EXISTS "Certificate_userId_idx" ON "Certificate"("userId");`,
      );
      await localClient.execute(
        `CREATE INDEX IF NOT EXISTS "Certificate_courseId_idx" ON "Certificate"("courseId");`,
      );

      await localClient.execute(`
        CREATE TABLE IF NOT EXISTS "LessonProgress" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "userId" TEXT NOT NULL,
          "lessonId" TEXT NOT NULL,
          "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `);
      await localClient.execute(
        `CREATE UNIQUE INDEX IF NOT EXISTS "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");`,
      );
      await localClient.execute(
        `CREATE INDEX IF NOT EXISTS "LessonProgress_userId_idx" ON "LessonProgress"("userId");`,
      );
      await localClient.execute(
        `CREATE INDEX IF NOT EXISTS "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");`,
      );
      console.log(
        "✓ Certificate and LessonProgress verified/created successfully on local SQLite!",
      );
    } catch (error) {
      console.error("✗ Failed to execute local migration SQL:", error);
    } finally {
      localClient.close();
    }
  }
}

main().catch(console.error);
