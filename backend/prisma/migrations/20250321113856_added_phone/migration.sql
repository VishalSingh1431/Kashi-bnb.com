/*
  Warnings:

  - Added the required column `phone` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `requests` ADD COLUMN `phone` VARCHAR(191) NOT NULL;
