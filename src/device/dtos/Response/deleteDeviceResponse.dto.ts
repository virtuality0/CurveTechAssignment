import { ApiProperty } from '@nestjs/swagger';

export class DeleteDeviceResponseDto {
  @ApiProperty({ example: 'true' })
  success: string;

  @ApiProperty({ example: 'Device deleted successfully.' })
  message: string;
}
