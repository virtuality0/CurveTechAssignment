import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty()
  success: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ example: 'a1b2c3d4e5f6' })
  id: string;
}
