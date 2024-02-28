import { Injectable } from '@nestjs/common';
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
    const result = {
      accessToken: this.jwtService.sign(user),
      nickname: user.profile.nickname,
    };

    return result;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }
}
