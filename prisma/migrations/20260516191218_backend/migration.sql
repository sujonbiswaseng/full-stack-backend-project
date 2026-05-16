/*
  Warnings:

  - You are about to drop the column `action` on the `UserActivity` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserActivity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[viewerId,eventid,category]` on the table `UserActivity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `viewerId` to the `UserActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserActivity" DROP CONSTRAINT "UserActivity_userId_fkey";

-- AlterTable
ALTER TABLE "UserActivity" DROP COLUMN "action",
DROP COLUMN "userId",
ADD COLUMN     "viewerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "UserActivity_viewerId_idx" ON "UserActivity"("viewerId");

-- CreateIndex
CREATE INDEX "UserActivity_eventid_idx" ON "UserActivity"("eventid");

-- CreateIndex
CREATE UNIQUE INDEX "UserActivity_viewerId_eventid_category_key" ON "UserActivity"("viewerId", "eventid", "category");
