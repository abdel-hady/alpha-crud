import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { setupCors } from './config/cors.config';
import { setupMiddleware } from './config/middleware.config';
import { setupDatabase } from './database/database';
import { setupGlobalPipes } from './pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const environment = process.env.NODE_ENV || 'development';
  dotenv.config({ path: `.env.${environment}` });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: ['log', 'error', 'warn'],
  });

  const configService = app.get(ConfigService);
  setupCors(app, configService);
  setupMiddleware(app);
  await setupDatabase(app);
  setupGlobalPipes(app);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}

bootstrap();
