import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus, DeviceType } from '@prisma/client';

export class RegisterDeviceRequestDto {
  @ApiProperty({ example: 'Device-1' })
  name: string;
  @ApiProperty({ enum: DeviceStatus })
  status: 'Active' | 'Inactive';
  @ApiProperty({ enum: DeviceType })
  type: 'Light' | 'Mobile';
}
