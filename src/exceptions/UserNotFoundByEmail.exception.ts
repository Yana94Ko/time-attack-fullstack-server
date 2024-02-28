import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundByEmailException extends HttpException {
  constructor() {
    super('존재하지 않는 이메일입니다.', HttpStatus.BAD_REQUEST);
  }
}
