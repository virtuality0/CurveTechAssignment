import { ApiProperty } from '@nestjs/swagger';

export class HeartbeatResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ example: 'Device heartbeat recorded' })
  message: string;

  @ApiProperty({ example: '2025-08-20T12:45:00.000Z' })
  last_active_at: Date;
}
