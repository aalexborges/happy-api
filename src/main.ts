import { NestFactory } from '@nestjs/core';

import { Env } from './app.env';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(Env.PORT);
}
bootstrap();
