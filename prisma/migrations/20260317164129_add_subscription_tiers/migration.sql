-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "tier" "SubscriptionTier" NOT NULL DEFAULT 'BASIC';

-- CreateIndex
CREATE INDEX "User_tier_idx" ON "User"("tier");
