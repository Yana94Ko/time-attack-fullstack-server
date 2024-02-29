import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Express } from 'express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/allException.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<Express>>(AppModule);
  const port = 5050;
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    //new ErrorsInterceptor(),
  );

  await app.listen(port, () => {
    console.log(`[BE Server] server is running af port no.${port}`);
  });
}
bootstrap();
