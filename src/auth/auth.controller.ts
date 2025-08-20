import { HttpCode, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { signUpSchema } from 'src/zodSchemas/signUp';
import { AuthService } from './auth.service';
import { signInSchema } from 'src/zodSchemas/signIn';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/jwtPayload';
import { SignUpDto } from './dtos/Request/signUpRequest.dto';
import { SignInDto } from './dtos/Request/signInRequest.dto';
import { SignupResponseDto } from './dtos/Response/signUpResponse.dto';
import { SignInResponseDto } from './dtos/Response/signInResponse.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { seconds, Throttle } from '@nestjs/throttler';

@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Throttle({ default: { limit: 10, ttl: seconds(30) } }) // custom ratelimit values for signUp endpoint
  @HttpCode(HttpStatus.CREATED)
  @Post('signUp')
  signUp(
    @Body(new ZodValidationPipe(signUpSchema)) userSignUpDto: SignUpDto,
  ): Promise<SignupResponseDto> {
    return this.authService.signUp(userSignUpDto);
  }

  @Post('signIn')
  async signIn(
    @Body(new ZodValidationPipe(signInSchema)) userSignInDto: SignInDto,
  ): Promise<SignInResponseDto> {
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
