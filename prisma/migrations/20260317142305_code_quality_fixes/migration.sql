-- =============================================================================
-- Migration: code_quality_fixes
-- Safely adds enums and indexes.
-- Existing string data is uppercased BEFORE the column type is changed,
-- so the USING cast can succeed without dropping any rows.
-- =============================================================================

-- ── 1. Create enum types ────────────────────────────────────────────────────

CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- ── 2. Migrate existing data to uppercase before type change ─────────────────

-- ChatMessage.role: 'user' → 'USER', 'assistant' → 'ASSISTANT'
UPDATE "ChatMessage" SET "role" = UPPER("role");

-- Match.status: 'pending' → 'PENDING', etc.
UPDATE "Match" SET "status" = UPPER("status");

-- MarriageProfile.gender: 'male' → 'MALE', 'female' → 'FEMALE'
UPDATE "MarriageProfile" SET "gender" = UPPER("gender");

-- ── 3. Alter column types using explicit USING cast and drop defaults ────────────

ALTER TABLE "ChatMessage" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "ChatMessage"
  ALTER COLUMN "role" TYPE "MessageRole"
  USING ("role"::"MessageRole");

ALTER TABLE "Match" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Match"
  ALTER COLUMN "status" TYPE "MatchStatus"
  USING ("status"::"MatchStatus");
ALTER TABLE "Match" ALTER COLUMN "status" SET DEFAULT 'PENDING';

ALTER TABLE "MarriageProfile" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "MarriageProfile"
  ALTER COLUMN "gender" TYPE "Gender"
  USING ("gender"::"Gender");

-- ── 4. Add missing indexes ───────────────────────────────────────────────────

-- Lecture
CREATE INDEX IF NOT EXISTS "Lecture_authorId_idx" ON "Lecture"("authorId");

-- LectureRevision
CREATE INDEX IF NOT EXISTS "LectureRevision_lectureId_idx" ON "LectureRevision"("lectureId");
CREATE INDEX IF NOT EXISTS "LectureRevision_authorId_idx" ON "LectureRevision"("authorId");

-- Match
CREATE INDEX IF NOT EXISTS "Match_requesterId_idx" ON "Match"("requesterId");
CREATE INDEX IF NOT EXISTS "Match_receiverId_idx"  ON "Match"("receiverId");
