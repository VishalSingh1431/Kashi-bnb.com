/*
  Warnings:

  - You are about to drop the column `kit` on the `hotels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "kit",
ADD COLUMN     "geyser" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "microwave" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "waterFilter" BOOLEAN NOT NULL DEFAULT false;
