/*
  Warnings:

  - A unique constraint covering the columns `[name,type,owner_id]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Device_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Device_name_type_owner_id_key" ON "public"."Device"("name", "type", "owner_id");
