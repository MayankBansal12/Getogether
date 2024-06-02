/*
  Warnings:

  - Added the required column `senderAvatar` to the `GroupMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `GroupMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupMessage" ADD COLUMN     "senderAvatar" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;
