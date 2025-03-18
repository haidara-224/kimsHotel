-- CreateTable
CREATE TABLE "CommentaireLogement" (
    "id" TEXT NOT NULL,
    "comment" VARCHAR(1000) NOT NULL,
    "logementId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentaireLogement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommentaireLogement" ADD CONSTRAINT "CommentaireLogement_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireLogement" ADD CONSTRAINT "CommentaireLogement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
