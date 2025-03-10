/*
  Warnings:

  - The values [APPARTEMENT] on the enum `Chambre_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `_reservationchambres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_reservationchambres` DROP FOREIGN KEY `_ReservationChambres_A_fkey`;

-- DropForeignKey
ALTER TABLE `_reservationchambres` DROP FOREIGN KEY `_ReservationChambres_B_fkey`;

-- DropIndex
DROP INDEX `Logement_nom_idx` ON `logement`;

-- AlterTable
ALTER TABLE `chambre` MODIFY `type` ENUM('SIMPLE', 'DOUBLE', 'SUITE') NOT NULL;

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `chambreId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_reservationchambres`;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_chambreId_fkey` FOREIGN KEY (`chambreId`) REFERENCES `Chambre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
