import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Env } from './shared/env/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: {
      origin: [
        'https://verbose-space-dollop-jwg7vpv9v64fq9x9-3000.app.github.dev',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      preflightContinue: false,
    }
  });
  app.use(cookieParser());
  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get('PORT', { infer: true });

  await app.listen(3333);
}
bootstrap();