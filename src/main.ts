import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

async function bootstrap() {
  // Create the Nest application as an Express application
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files (for uploaded photos) from the "uploads" directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // Get the Sequelize instance and sync the database models
  const sequelize = app.get(Sequelize);
  await sequelize.sync();

  // Start the application on port 3000
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
