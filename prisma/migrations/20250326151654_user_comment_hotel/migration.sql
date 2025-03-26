-- CreateTable
CREATE TABLE "CommentaireHotel" (
    "id" TEXT NOT NULL,
    "comment" VARCHAR(1000) NOT NULL,
    "hotelId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentaireHotel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentaireHotel" ADD CONSTRAINT "CommentaireHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireHotel" ADD CONSTRAINT "CommentaireHotel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
