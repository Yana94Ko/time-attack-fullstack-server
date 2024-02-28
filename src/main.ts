import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Express } from 'express';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './filters/PrismaClientKnownRequest.filter';
import { AllExceptionsFilter } from './filters/allException.filter';
import { HttpExceptionFilter } from './filters/httpException.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<Express>>(AppModule);
  const port = 5050;
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(),
    new HttpExceptionFilter(),
    new AllExceptionsFilter(httpAdapter),
  );
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    //new ErrorsInterceptor(),
  );

  await app.listen(port, () => {
    console.log(`[BE Server] server is running af port no.${port}`);
  });
}
bootstrap();
