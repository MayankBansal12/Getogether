/*
  Warnings:

  - You are about to drop the column `photographerId` on the `Photo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_photographerId_fkey";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "photographerId";
