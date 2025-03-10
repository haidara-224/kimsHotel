-- AlterTable
ALTER TABLE `categorylogement` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `chambre` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `logement` MODIFY `description` VARCHAR(1000) NULL;

-- AlterTable
ALTER TABLE `logementoption` MODIFY `description` VARCHAR(1000) NOT NULL;
