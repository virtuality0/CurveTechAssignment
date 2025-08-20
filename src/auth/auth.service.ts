import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { SignUpDto } from './dtos/Request/signUpRequest.dto';
import { SignInDto } from './dtos/Request/signInRequest.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: signUpDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'This email is associated with an existing account.',
      );
    }

    // hashing password before storing in DB
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    // Signing up the user
    const user = await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        name: signUpDto.name,
        password: hashedPassword,
        role: UserRole.User,
      },
    });

    return {
      success: 'true',
      message: 'User signed up successfully.',
      id: user.id,
    };
  }

  async signIn(signInDto: SignInDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('Invalid credentials.');
    }

    return existingUser;
  }
}
