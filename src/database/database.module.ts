import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypass',
      database: 'mydb',
      models: [__dirname + '/**/*.model.ts'],
    }),
  ],
})
export class DatabaseModule {}
