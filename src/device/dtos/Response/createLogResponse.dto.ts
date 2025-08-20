import { ApiProperty } from '@nestjs/swagger';

export class CreateLogResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ example: 'Log created successfully.' })
  message: string;
}
