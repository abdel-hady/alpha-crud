import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

export const setupMiddleware = (app: NestExpressApplication) => {
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'));
};
