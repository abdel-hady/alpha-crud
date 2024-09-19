import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/orders/order.model';
import { Product } from 'src/products/product.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mypass',
      database: 'mydb',
      models: [Product, Order],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
