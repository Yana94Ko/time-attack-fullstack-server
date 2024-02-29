import {
  BadRequestException,
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
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.cookies['accessToken'];
    const accountTypeInDecorator =
      this.reflector.getAllAndOverride<AccountType>('accountType', [
        context.getHandler(),
        context.getClass(),
      ]);

    if (!accessToken) {
      //토큰이 없지만 데코레이터가 있다면 예외처리
      if (accountTypeInDecorator) {
        throw new UnauthorizedException('No Access Token');
      } else {
        //토큰이 없고 데코레이터도 없다면 return
        return true;
      }
    } else {
      try {
        const secretKey =
          this.configService.getOrThrow<string>('JWT_SECRET_KEY');
        const { sub: id, accountType: accountTypeInAccessToken } =
          this.jwtService.verify(accessToken, {
            secret: secretKey,
          }) as JwtPayload & {
            accountType: AccountType;
          };

        if (!accountTypeInDecorator) {
          //토큰이 있지만 데코레이터가 없다면 req.user에 세팅
          const user = await this.prismaService.user.findFirstOrThrow({
            where: { id },
            include: { profile: { select: { nickname: true } } },
          });
          request.user = user;
        } else {
          //토큰과 데코레이터가 있다면 유효성 검사
          if (accountTypeInDecorator !== accountTypeInAccessToken)
            throw new BadRequestException('');
          if (accountTypeInDecorator === 'user') {
            const user = await this.prismaService.user.findFirstOrThrow({
              where: { id },
              include: { profile: { select: { nickname: true } } },
            });
            request.user = user;
          }
        }
      } catch (e) {
        throw new UnauthorizedException(e.message);
      }
    }

    return true;
  }
}
