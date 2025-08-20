import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '@prisma/client';

export class CreateLogRequestDto {
  @ApiProperty({ enum: EventType })
  event: EventType;

  @ApiProperty({ example: 1.5 })
  value: number;
}
