-- DropForeignKey
ALTER TABLE "public"."Device" DROP CONSTRAINT "Device_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Log" DROP CONSTRAINT "Log_deviceId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Log" ADD CONSTRAINT "Log_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
