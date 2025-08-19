import { HttpCode, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { type signUpDto, signUpSchema } from 'src/zodSchemas/signUp';
import { AuthService } from './auth.service';
import { type signInDto, signInSchema } from 'src/zodSchemas/signIn';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwtPayload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signUp')
  signUp(@Body(new ZodValidationPipe(signUpSchema)) userSignUpDto: signUpDto) {
    return this.authService.signUp(userSignUpDto);
  }

  @Post('signIn')
  async signIn(
    @Body(new ZodValidationPipe(signInSchema)) userSignInDto: signInDto,
  ) {
    const User = await this.authService.signIn(userSignInDto);

    const payload: JwtPayload = {
      id: User.id,
      email: User.email,
      role: User.role,
    };
    const access_token = this.jwtService.sign(payload);

    return {
      success: 'true',
      token: access_token,
      user: {
        id: User.id,
        name: User.name,
        email: User.email,
        role: User.role,
      },
    };
  }
}
