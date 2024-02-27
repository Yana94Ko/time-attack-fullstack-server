import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor() {
    super('CustomException', HttpStatus.FOUND);
  }
}
