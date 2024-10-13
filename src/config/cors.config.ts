import { NestExpressApplication } from '@nestjs/platform-express';

export const setupCors = (app: NestExpressApplication) => {
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};
