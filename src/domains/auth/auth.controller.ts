import { Body, Controller, Post, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { DAccountType } from 'src/decorators/accountType.decorator';
import { Private } from 'src/decorators/private.decorator';
import { AuthLogInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/accounts/users/log-in')
  async logIn(
    @Body() dto: AuthLogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.logIn(dto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, //2h
    });

    return { accessToken };
  }

  @Post('/accounts/users/log-out')
  @Private('user')
  async logOut(
    @Res({ passthrough: true }) res: Response,
    @DAccountType('user') user: User,
  ) {
    res.clearCookie('accessToken');
    return `${user.email} successfully logout`;
  }

  @Post('/accounts/users/refresh-token')
  @Private('user')
  async refreshAccessToken(
    @Res({ passthrough: true }) res: Response,
    @DAccountType('user') user: User,
  ) {
    const accessToken = await this.authService.refreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, //2h
    });

    return { accessToken };
  }
}
