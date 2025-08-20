/*
  Warnings:

  - The `value` column on the `Log` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `event` on the `Log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('units_consumed');

-- AlterTable
ALTER TABLE "public"."Log" DROP COLUMN "event",
ADD COLUMN     "event" "public"."EventType" NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" DOUBLE PRECISION;
