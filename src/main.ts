import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  const sequelize = app.get(Sequelize);
  await sequelize.sync();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formatErrors = (validationErrors) => {
          return validationErrors.flatMap((error) => {
            if (error.constraints) {
              return {
                field: error.property,
                errors: Object.values(error.constraints),
              };
            } else if (error.children && error.children.length > 0) {
              return formatErrors(error.children).map((nestedError) => ({
                field: `${error.property}.${nestedError.field}`,
                errors: nestedError.errors,
              }));
            }
            return [];
          });
        };

        const formattedErrors = formatErrors(errors);

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
