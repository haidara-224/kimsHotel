-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `chambreId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_chambreId_fkey` FOREIGN KEY (`chambreId`) REFERENCES `Chambre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
