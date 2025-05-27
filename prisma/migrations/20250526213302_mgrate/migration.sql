/*
  Warnings:

  - You are about to drop the column `paycard_operation_status` on the `Paiement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Paiement" DROP COLUMN "paycard_operation_status",
ADD COLUMN     "transaction_reference" TEXT;
