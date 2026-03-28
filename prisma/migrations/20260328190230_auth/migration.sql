/*
  Warnings:

  - The values [PUBLIC_PAID,PRIVATE_PAID] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('FREE', 'PAID');

-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('PUBLIC', 'PRIVATE');
ALTER TABLE "public"."Event" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "visibility" TYPE "EventType_new" USING ("visibility"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
ALTER TABLE "Event" ALTER COLUMN "visibility" SET DEFAULT 'PUBLIC';
COMMIT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "priceType" "PricingType" NOT NULL DEFAULT 'FREE';
