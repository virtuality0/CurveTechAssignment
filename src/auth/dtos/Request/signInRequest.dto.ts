import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'alice@abc.com' })
  email: string;
  @ApiProperty()
  password: string;
}
