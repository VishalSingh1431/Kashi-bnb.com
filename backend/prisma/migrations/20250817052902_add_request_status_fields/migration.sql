/*
  Warnings:

  - Added the required column `updatedAt` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add nullable columns
ALTER TABLE "requests" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3),
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectedBy" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'pending';

-- Update existing records with default values
UPDATE "requests" SET 
    "createdAt" = CURRENT_TIMESTAMP,
    "status" = 'pending'
WHERE "createdAt" IS NULL;

-- Now make createdAt NOT NULL
ALTER TABLE "requests" ALTER COLUMN "createdAt" SET NOT NULL;

-- Add updatedAt column with default value
ALTER TABLE "requests" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have updatedAt = createdAt
UPDATE "requests" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;
