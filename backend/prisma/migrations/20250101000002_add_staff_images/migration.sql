-- AddStaffImages
CREATE TABLE "staffimages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "staffimages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "staffimages" ADD CONSTRAINT "staffimages_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
