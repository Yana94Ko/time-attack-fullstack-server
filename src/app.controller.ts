import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  healthCheck(): string {
    return this.appService.healthCheck();
  }
  @Get('/exception-check')
  exceptionCheck(): string {
    return this.appService.exceptionCheck();
  }
  @Get('/error-check')
  errorCheck(): string {
    return this.appService.errorCheck();
  }
}
