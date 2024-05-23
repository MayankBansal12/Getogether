-- DropForeignKey
ALTER TABLE "ChannelParticipant" DROP CONSTRAINT "ChannelParticipant_participantId_fkey";

-- DropIndex
DROP INDEX "ChatParticipant_participantId_key";

-- DropIndex
DROP INDEX "EventParticipant_userId_key";

-- AddForeignKey
ALTER TABLE "ChannelParticipant" ADD CONSTRAINT "ChannelParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "EventParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
