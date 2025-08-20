import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ example: 'Device updated successfully.' })
  message: string;
}
