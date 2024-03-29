import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserSignUpDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('accounts/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(
    @Body() dto: UserSignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.usersService.signUp(dto);

    res.cookie('accessToken', accessToken, {
      domain:
        'port-0-time-attack-fullstack-server-am952nltdolcl9.sel5.cloudtype.app',
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 2 * 60 * 60 * 1000, //2h
    });

    return { accessToken };
  }
}
