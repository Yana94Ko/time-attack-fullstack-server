import { Injectable } from '@nestjs/common';
import { CustomException } from './exceptions/custom.exception';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'OK';
  }

  exceptionCheck(): string {
    throw new CustomException();
  }

  errorCheck(): string {
    throw new Error('error');
  }
}
