-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bgimage" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
