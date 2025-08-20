import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus, DeviceType } from '@prisma/client';

export class UpdateDeviceRequestDto {
  @ApiProperty({ example: 'Device-1', nullable: true })
  name?: string;
  @ApiProperty({ enum: DeviceStatus, nullable: true })
  status?: 'Active' | 'Inactive';
  @ApiProperty({ enum: DeviceType, nullable: true })
  type?: 'Light' | 'Mobile';
}
