-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('CLIENT', 'HOTELIER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TypeChambre" AS ENUM ('SIMPLE', 'DOUBLE', 'SUITE');

-- CreateEnum
CREATE TYPE "StatutReservations" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StatutPaiements" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "TypePaiement" AS ENUM ('ORANGE_MONEY', 'WAVE', 'PAYPAL', 'STRIPE');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "Roles" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "email" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "CategoryLogement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "urlImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoryLogement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageHotel" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "urlImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageHotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryLogementId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "adresse" TEXT,
    "ville" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "note" DOUBLE PRECISION,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "etoils" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryLogementId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "adresse" TEXT,
    "ville" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "hasTV" BOOLEAN NOT NULL DEFAULT false,
    "hasClim" BOOLEAN NOT NULL DEFAULT false,
    "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "surface" INTEGER,
    "extraBed" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "note" DOUBLE PRECISION,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "nbChambres" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogementOptionOnLogement" (
    "logementId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "LogementOptionOnLogement_pkey" PRIMARY KEY ("logementId","optionId")
);

-- CreateTable
CREATE TABLE "HotelOptionOnHotel" (
    "hotelId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "logementId" TEXT,

    CONSTRAINT "HotelOptionOnHotel_pkey" PRIMARY KEY ("hotelId","optionId")
);

-- CreateTable
CREATE TABLE "Chambre" (
    "id" TEXT NOT NULL,
    "numero_chambre" TEXT,
    "hotelId" TEXT NOT NULL,
    "description" VARCHAR(1000),
    "type" "TypeChambre" NOT NULL,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "hasTV" BOOLEAN NOT NULL DEFAULT false,
    "hasClim" BOOLEAN NOT NULL DEFAULT false,
    "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
    "surface" INTEGER,
    "extraBed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chambre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "logementId" TEXT,
    "hotelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "StatutReservations" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT,
    "logementId" TEXT,
    "chambreId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "id" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "userId" TEXT,
    "logementId" TEXT,
    "hotelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "ImageLogement" (
    "id" TEXT NOT NULL,
    "logementId" TEXT NOT NULL,
    "urlImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageLogement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageChambre" (
    "id" TEXT NOT NULL,
    "chambreId" TEXT NOT NULL,
    "urlImage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageChambre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "status" "StatutPaiements" NOT NULL DEFAULT 'PENDING',
    "type" "TypePaiement" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleAppartement" (
    "id" TEXT NOT NULL,
    "logementId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoleAppartement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleHotel" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoleHotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLogement_name_key" ON "CategoryLogement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_nom_key" ON "Hotel"("nom");

-- CreateIndex
CREATE INDEX "Hotel_nom_idx" ON "Hotel"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Logement_nom_key" ON "Logement"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Chambre_numero_chambre_key" ON "Chambre"("numero_chambre");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_reservationId_key" ON "Paiement"("reservationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAppartement_userId_logementId_key" ON "UserRoleAppartement"("userId", "logementId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleHotel_userId_hotelId_key" ON "UserRoleHotel"("userId", "hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageHotel" ADD CONSTRAINT "ImageHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_categoryLogementId_fkey" FOREIGN KEY ("categoryLogementId") REFERENCES "CategoryLogement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logement" ADD CONSTRAINT "Logement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logement" ADD CONSTRAINT "Logement_categoryLogementId_fkey" FOREIGN KEY ("categoryLogementId") REFERENCES "CategoryLogement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogementOptionOnLogement" ADD CONSTRAINT "LogementOptionOnLogement_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogementOptionOnLogement" ADD CONSTRAINT "LogementOptionOnLogement_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelOptionOnHotel" ADD CONSTRAINT "HotelOptionOnHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelOptionOnHotel" ADD CONSTRAINT "HotelOptionOnHotel_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chambre" ADD CONSTRAINT "Chambre_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireLogement" ADD CONSTRAINT "CommentaireLogement_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireLogement" ADD CONSTRAINT "CommentaireLogement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireHotel" ADD CONSTRAINT "CommentaireHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentaireHotel" ADD CONSTRAINT "CommentaireHotel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageLogement" ADD CONSTRAINT "ImageLogement_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageChambre" ADD CONSTRAINT "ImageChambre_chambreId_fkey" FOREIGN KEY ("chambreId") REFERENCES "Chambre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAppartement" ADD CONSTRAINT "UserRoleAppartement_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "Logement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAppartement" ADD CONSTRAINT "UserRoleAppartement_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAppartement" ADD CONSTRAINT "UserRoleAppartement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHotel" ADD CONSTRAINT "UserRoleHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHotel" ADD CONSTRAINT "UserRoleHotel_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleHotel" ADD CONSTRAINT "UserRoleHotel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
