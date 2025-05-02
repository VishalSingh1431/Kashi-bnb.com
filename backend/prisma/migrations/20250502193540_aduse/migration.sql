/*
  Warnings:

  - Added the required column `type` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'hotelowner', 'restaurantowner');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "type" "UserType" NOT NULL;
