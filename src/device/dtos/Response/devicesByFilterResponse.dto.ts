import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus, DeviceType } from '@prisma/client';

export class Device {
  @ApiProperty({ example: 'dvc123456' })
  id: string;

  @ApiProperty({ example: 'Device-1' })
  name: string;

  @ApiProperty({ enum: DeviceType })
  type: DeviceType;

  @ApiProperty({ enum: DeviceStatus })
  status: DeviceStatus;

  @ApiProperty({ example: '2025-08-20T12:45:00.000Z' })
  last_active_at: Date;

  @ApiProperty({ example: 'usr78910' })
  owner_id: string;
}

export class DeviceByFilterResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ type: [Device] })
  devices: Device[];
}
