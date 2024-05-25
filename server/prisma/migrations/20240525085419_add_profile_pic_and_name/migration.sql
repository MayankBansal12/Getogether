/*
  Warnings:

  - Added the required column `PicName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePic` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PicName" TEXT NOT NULL,
ADD COLUMN     "profilePic" TEXT NOT NULL;
