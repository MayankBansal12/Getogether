/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `EventTable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventTable_eventId_key" ON "EventTable"("eventId");
