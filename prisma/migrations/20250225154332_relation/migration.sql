-- DropForeignKey
ALTER TABLE `imagechambre` DROP FOREIGN KEY `ImageChambre_chambreId_fkey`;

-- DropForeignKey
ALTER TABLE `imagelogement` DROP FOREIGN KEY `ImageLogement_logementId_fkey`;

-- DropForeignKey
ALTER TABLE `paiement` DROP FOREIGN KEY `Paiement_reservationId_fkey`;

-- DropIndex
DROP INDEX `ImageChambre_chambreId_fkey` ON `imagechambre`;

-- DropIndex
DROP INDEX `ImageLogement_logementId_fkey` ON `imagelogement`;

-- AddForeignKey
ALTER TABLE `ImageLogement` ADD CONSTRAINT `ImageLogement_logementId_fkey` FOREIGN KEY (`logementId`) REFERENCES `Logement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ImageChambre` ADD CONSTRAINT `ImageChambre_chambreId_fkey` FOREIGN KEY (`chambreId`) REFERENCES `Chambre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
