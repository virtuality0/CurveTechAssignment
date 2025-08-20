import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@prisma/client';

export class UpdateHeartbeatRequestDto {
  @ApiProperty({ enum: DeviceStatus })
  status: 'Active' | 'Inactive';
}
