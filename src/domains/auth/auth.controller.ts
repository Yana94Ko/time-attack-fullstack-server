import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
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
      domain: process.env.FRONT_SERVER,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
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
  async refreshAccessToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    if (!req.user) return false;
    const accessToken = await this.authService.refreshToken(req.user);

    res.cookie('accessToken', accessToken, {
      domain: process.env.FRONT_SERVER,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 2 * 60 * 60 * 1000, //2h
    });

    return true;
  }
}
