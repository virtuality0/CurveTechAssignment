import { ApiProperty } from '@nestjs/swagger';

export class AggregatedUsageResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ example: 'dvc123456' })
  device_id: string;

  @ApiProperty({ example: 128.5 })
  total_units_last_24h: number;
}
