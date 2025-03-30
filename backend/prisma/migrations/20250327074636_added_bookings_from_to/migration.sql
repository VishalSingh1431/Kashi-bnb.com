/*
  Warnings:

  - Added the required column `from` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `from` DATETIME(3) NOT NULL,
    ADD COLUMN `to` DATETIME(3) NOT NULL;
