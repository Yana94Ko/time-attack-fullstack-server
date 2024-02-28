import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { InvalidPasswordException } from 'src/exceptions/InvalidPassword.exception';
import { UserNotFoundByEmailException } from './../../exceptions/UserNotFoundByEmail.exception';
import { AuthLogInDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async logIn(dto: AuthLogInDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new UserNotFoundByEmailException();

    const validPassword = await compare(password, user.encryptedPassword);

    if (!validPassword) throw new InvalidPasswordException();

    const accessToken = this.jwtService.sign(
      { id: user.id, sub: user.email },
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );

    return accessToken;
  }

  async refreshToken(user: Pick<User, 'id' | 'email'>) {
    const accessToken = this.jwtService.sign(
      { id: user.id, sub: user.email },
      {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );

    return accessToken;
  }
}
