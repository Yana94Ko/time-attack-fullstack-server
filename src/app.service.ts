import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return 'OK';
  }

  exceptionCheck(): string {
    throw new ForbiddenException('exception testing');
  }

  errorCheck(): string {
    throw new Error('error');
  }
}
