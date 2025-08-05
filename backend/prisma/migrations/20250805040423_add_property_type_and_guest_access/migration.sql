-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "guestAccess" TEXT NOT NULL DEFAULT 'Entire place',
ADD COLUMN     "propertyType" TEXT NOT NULL DEFAULT 'House';
