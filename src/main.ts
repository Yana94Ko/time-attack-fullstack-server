import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Express } from 'express';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication<Express>>(AppModule);
  const port = 5050;

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port, () => {
    console.log(`[BE Server] server is running af port no.${port}`);
  });
}
bootstrap();
