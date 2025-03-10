/*
  Warnings:

  - You are about to drop the column `logementId` on the `chambre` table. All the data in the column will be lost.
  - You are about to drop the column `etoils` on the `logement` table. All the data in the column will be lost.
  - You are about to drop the column `chambreId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the `logementoption` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nom]` on the table `Logement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hotelId` to the `Chambre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nbChambres` to the `Logement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Logement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chambre` DROP FOREIGN KEY `Chambre_logementId_fkey`;

-- DropForeignKey
ALTER TABLE `logementoptiononlogement` DROP FOREIGN KEY `LogementOptionOnLogement_optionId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_chambreId_fkey`;

-- DropIndex
DROP INDEX `Chambre_logementId_fkey` ON `chambre`;

-- DropIndex
DROP INDEX `LogementOptionOnLogement_optionId_fkey` ON `logementoptiononlogement`;

-- DropIndex
DROP INDEX `Reservation_chambreId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `avis` ADD COLUMN `hotelId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `chambre` DROP COLUMN `logementId`,
    ADD COLUMN `hotelId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `favorite` ADD COLUMN `hotelId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `logement` DROP COLUMN `etoils`,
    ADD COLUMN `capacity` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `disponible` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `extraBed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasClim` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasKitchen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasTV` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasWifi` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `nbChambres` INTEGER NOT NULL,
    ADD COLUMN `price` INTEGER NOT NULL,
    ADD COLUMN `surface` INTEGER NULL;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `chambreId`;

-- DropTable
DROP TABLE `logementoption`;

-- CreateTable
CREATE TABLE `Option` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(1000) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImageHotel` (
    `id` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `urlImage` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hotel` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `categoryLogementId` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(1000) NULL,
    `adresse` VARCHAR(191) NULL,
    `ville` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `parking` BOOLEAN NOT NULL DEFAULT false,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `note` DOUBLE NULL,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `etoils` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Hotel_nom_key`(`nom`),
    INDEX `Hotel_nom_idx`(`nom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotelOptionOnHotel` (
    `hotelId` VARCHAR(191) NOT NULL,
    `optionId` VARCHAR(191) NOT NULL,
    `logementId` VARCHAR(191) NULL,

    PRIMARY KEY (`hotelId`, `optionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ReservationChambres` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ReservationChambres_AB_unique`(`A`, `B`),
    INDEX `_ReservationChambres_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Logement_nom_key` ON `Logement`(`nom`);

-- CreateIndex
CREATE INDEX `Logement_nom_idx` ON `Logement`(`nom`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `ImageHotel` ADD CONSTRAINT `ImageHotel_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_categoryLogementId_fkey` FOREIGN KEY (`categoryLogementId`) REFERENCES `CategoryLogement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogementOptionOnLogement` ADD CONSTRAINT `LogementOptionOnLogement_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelOptionOnHotel` ADD CONSTRAINT `HotelOptionOnHotel_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HotelOptionOnHotel` ADD CONSTRAINT `HotelOptionOnHotel_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avis` ADD CONSTRAINT `Avis_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chambre` ADD CONSTRAINT `Chambre_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReservationChambres` ADD CONSTRAINT `_ReservationChambres_A_fkey` FOREIGN KEY (`A`) REFERENCES `Chambre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReservationChambres` ADD CONSTRAINT `_ReservationChambres_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
