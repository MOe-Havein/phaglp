-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
