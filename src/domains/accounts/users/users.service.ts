import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import generateRandomId from 'src/utils/generateRandomId';
import { PrismaService } from './../../../db/prisma/prisma.service';
import { UserSignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(dto: UserSignUpDto) {
    const { email, password } = dto;
    const data: Prisma.UserCreateInput = {
      id: generateRandomId(),
      email,
      encryptedPassword: await hash(password, 12),
    };
    const user = await this.prismaService.user.create({
      data,
      select: {
        id: true,
        email: true,
        profile: { select: { nickname: true } },
      },
    });

    return this.jwtService.sign(
      {
        email: email,
        sub: user.id,
        accountType: 'user',
        nickname: user.profile.nickname,
      },
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }
}
