import { Sequelize } from 'sequelize-typescript';
import { NestExpressApplication } from '@nestjs/platform-express';

export const setupDatabase = async (app: NestExpressApplication) => {
  const sequelize = app.get(Sequelize);
  await sequelize.sync();
};
