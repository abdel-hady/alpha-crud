import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

export const setupCors = (
  app: NestExpressApplication,
  configService: ConfigService,
) => {
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};
