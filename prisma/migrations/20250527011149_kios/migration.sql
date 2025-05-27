/*
  Warnings:

  - You are about to drop the column `paycard_operation_reference` on the `Paiement` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Paiement_paycard_operation_reference_key";

-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "paycard_operation_reference";
