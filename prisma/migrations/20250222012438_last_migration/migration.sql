/*
  Warnings:

  - Added the required column `categoryLogementId` to the `Logement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `logement` ADD COLUMN `categoryLogementId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `LogementOptionOnLogement` (
    `logementId` VARCHAR(191) NOT NULL,
    `optionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`logementId`, `optionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Logement` ADD CONSTRAINT `Logement_categoryLogementId_fkey` FOREIGN KEY (`categoryLogementId`) REFERENCES `CategoryLogement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogementOptionOnLogement` ADD CONSTRAINT `LogementOptionOnLogement_logementId_fkey` FOREIGN KEY (`logementId`) REFERENCES `Logement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogementOptionOnLogement` ADD CONSTRAINT `LogementOptionOnLogement_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `LogementOption`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
