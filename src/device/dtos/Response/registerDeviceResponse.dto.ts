import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus, DeviceType } from '@prisma/client';

export class Device {
  @ApiProperty({ example: 'dvc123456' })
  id: string;

  @ApiProperty({ example: 'Thermostat' })
  name: string;

  @ApiProperty({ enum: DeviceType })
  type: DeviceType;

  @ApiProperty({ enum: DeviceStatus })
  status: DeviceStatus;

  @ApiProperty({ example: '2025-08-20T13:15:00.000Z' })
  last_active_at: Date;

  @ApiProperty({ example: 'usr78910' })
  ownerId: string;
}

export class RegisterDeviceResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ type: Device })
  device: Device;
}
