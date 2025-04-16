/*
  Warnings:

  - Made the column `hotelId` on table `UserRoleHotel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserRoleHotel" ALTER COLUMN "hotelId" SET NOT NULL;
