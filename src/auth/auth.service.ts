import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { signUpDto } from 'src/zodSchemas/signUp';
import { signInDto } from 'src/zodSchemas/signIn';
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(signUpDto: signUpDto) {
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
      success: true,
      message: 'User signed up successfully.',
      id: user.id,
    };
  }

  async signIn(signInDto: signInDto) {
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
