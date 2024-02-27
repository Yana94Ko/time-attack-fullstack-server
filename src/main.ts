import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 5050;
  await app.listen(port, () => {
    console.log(`[BE Server] server is running af port no.${port}`);
  });
}
bootstrap();
