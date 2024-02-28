/*
  Warnings:

  - A unique constraint covering the columns `[userId,dealId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_dealId_key" ON "Bookmark"("userId", "dealId");
