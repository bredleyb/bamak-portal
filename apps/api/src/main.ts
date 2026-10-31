import { NestFactory } from '@nestjs/core';
import type { Express } from 'express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { createCorsOptions } from './common/cors-options';
import { createRequestValidationPipe } from './common/validation/request-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    const expressApp =
      app.getHttpAdapter().getInstance() as Express;

    expressApp.set('trust proxy', 1);
  }
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(createRequestValidationPipe());

  app.enableCors(createCorsOptions(config.get<string>('WEB_URL')));

  const port = config.get<number>('PORT') ?? 3001;

  await app.listen(port);
}

void bootstrap();
