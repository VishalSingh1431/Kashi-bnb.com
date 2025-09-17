-- Add new fields for additional charges and iCal integration
ALTER TABLE "hotels" ADD COLUMN "petCharge" DECIMAL(65,30) NOT NULL DEFAULT 0.0;
ALTER TABLE "hotels" ADD COLUMN "extraAdultCharge" DECIMAL(65,30) NOT NULL DEFAULT 0.0;
ALTER TABLE "hotels" ADD COLUMN "icalLink" TEXT;

