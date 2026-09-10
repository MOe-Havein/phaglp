import { DatabaseSync } from "node:sqlite";
import path from "path";

async function run() {
  const dbPath = path.join(__dirname, "dev.db");
  const db = new DatabaseSync(dbPath);

  console.log("⚡ Ensuring database table structures exist...");

  // 1. Ensure HomepageSection structure exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS "HomepageSection" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "type" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "ctaLabel" TEXT,
      "ctaHref" TEXT,
      "mediaUrl" TEXT,
      "mediaAlt" TEXT,
      "seoTitle" TEXT,
      "seoDescription" TEXT,
      "visible" INTEGER NOT NULL DEFAULT 1,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TEXT NOT NULL,
      "updatedAt" TEXT NOT NULL
    );
  `);

  // 2. Ensure Lecture structure exists (Matches standard Prisma layouts)
  db.exec(`
    CREATE TABLE IF NOT EXISTS "Lecture" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "description" TEXT,
      "content" TEXT,
      "published" INTEGER NOT NULL DEFAULT 0,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TEXT NOT NULL,
      "updatedAt" TEXT NOT NULL
    );
  `);

  // Make sure there is a unique index on the slug field
  db.exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Lecture_slug_key" ON "Lecture"("slug");`,
  );

  console.log("🚀 Injecting raw mock payloads into SQLite...");

  // 3. Inject into HomepageSection
  const insertSection = db.prepare(`
    INSERT OR IGNORE INTO "HomepageSection" 
    (id, type, title, body, ctaLabel, ctaHref, visible, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  // 4. Inject into Lecture
  const insertLecture = db.prepare(`
    INSERT OR IGNORE INTO "Lecture" 
    (id, slug, title, description, content, published, "order", createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  db.exec("BEGIN TRANSACTION;");

  // Seed Homepage Section Row
  insertSection.run(
    "raw-hero",
    "HERO",
    "Native Injection Complete",
    "This homepage content was loaded via Node.js built-in runtime engines.",
    "Explore Now",
    "/explore",
    1,
    1,
    new Date().toISOString(),
    new Date().toISOString(),
  );

  // Seed Mock Lectures Rows (Satisfies findMany parameters)
  insertLecture.run(
    "lecture-1",
    "introduction-to-nextjs-15",
    "Introduction to Next.js 15 & Turbopack",
    "Master the fundamentals of the App Router, Server Components, and optimized compilation environments.",
    "Full rich text content goes here...",
    1, // published = true
    1,
    new Date().toISOString(),
    new Date().toISOString(),
  );

  insertLecture.run(
    "lecture-2",
    "advanced-prisma-architectures",
    "Advanced Database Layouts with Prisma",
    "How to handle schema migrations, multi-datasource synchronization, and performance optimization.",
    "Full rich text content goes here...",
    1, // published = true
    2,
    new Date().toISOString(),
    new Date().toISOString(),
  );

  db.exec("COMMIT;");

  console.log("✅ Local data and schemas injected successfully!");
  db.close();
}

run();
