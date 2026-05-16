-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PREMIUM');

-- AlterEnum
ALTER TYPE "ReviewStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "promptCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "promptResetAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AIContent" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "generatedText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIContent" ADD CONSTRAINT "AIContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
