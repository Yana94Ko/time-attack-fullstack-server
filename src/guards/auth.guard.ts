import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AccountType } from 'aws-sdk/clients/chime';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from './../db/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accountTypeInDecorator =
      this.reflector.getAllAndOverride<AccountType>('accountType', [
        context.getHandler(),
        context.getClass(),
      ]);
    if (!accountTypeInDecorator) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies['accessToken'];

    if (!accessToken) throw new UnauthorizedException('No Access Token');

    try {
      const secretKey = this.configService.getOrThrow<string>('JWT_SECRET_KEY');
      const { sub: id, accountType: accountTypeInAccessToken } =
        this.jwtService.verify(accessToken, {
          secret: secretKey,
        }) as JwtPayload & {
          accountType: AccountType;
        };

      if (accountTypeInDecorator !== accountTypeInAccessToken)
        throw new Error();

      if (accountTypeInDecorator === 'user') {
        const user = await this.prismaService.user.findFirstOrThrow({
          where: { id },
        });
        request.user = user;
      }
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    return true;
  }
}
