import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { setupCors } from './config/cors.config';
import { setupMiddleware } from './config/middleware.config';
import { setupDatabase } from './database/database';
import { setupGlobalPipes } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupCors(app);
  setupMiddleware(app);
  await setupDatabase(app);
  setupGlobalPipes(app);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
