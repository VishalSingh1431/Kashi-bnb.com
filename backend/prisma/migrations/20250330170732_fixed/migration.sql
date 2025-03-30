-- AlterTable
ALTER TABLE `hotels` ADD COLUMN `details` VARCHAR(191) NOT NULL DEFAULT 'This is beutiful hotel',
    ADD COLUMN `maxInRoom` INTEGER NOT NULL DEFAULT 2,
    ADD COLUMN `totalRoom` INTEGER NOT NULL DEFAULT 2;
