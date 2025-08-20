import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ example: 'alice@abc.com' })
  email: string;
  @ApiProperty()
  password: string;
}
