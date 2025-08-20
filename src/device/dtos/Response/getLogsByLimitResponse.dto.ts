import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class Log {
  @ApiProperty({ example: 'log123456' })
  id: string;

  @ApiProperty({ example: 42, nullable: true })
  value: number | null;

  @ApiProperty({ enum: EventType })
  event: 'units_consumed';

  @ApiProperty({ example: '2025-08-20T13:00:00.000Z' })
  timestamp: Date;
}

export class GetLogByLimitResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ type: [Log] })
  logs: Log[];
}
