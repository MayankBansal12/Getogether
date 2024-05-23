-- CreateTable
CREATE TABLE "FCM" (
    "userId" INTEGER NOT NULL,
    "endPoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,

    CONSTRAINT "FCM_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FCM_userId_key" ON "FCM"("userId");

-- AddForeignKey
ALTER TABLE "FCM" ADD CONSTRAINT "FCM_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
