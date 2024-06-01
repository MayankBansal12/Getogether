/*
  Warnings:

  - Added the required column `url` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "embeddings" DOUBLE PRECISION[] DEFAULT ARRAY[]::DOUBLE PRECISION[],
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PhotoParticipant" (
    "id" SERIAL NOT NULL,
    "photoId" INTEGER NOT NULL,
    "participantId" INTEGER NOT NULL,

    CONSTRAINT "PhotoParticipant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhotoParticipant" ADD CONSTRAINT "PhotoParticipant_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoParticipant" ADD CONSTRAINT "PhotoParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "EventParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
