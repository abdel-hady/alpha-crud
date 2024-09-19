import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.model';
import { OrdersController } from './orders/orders.controller';
import { OrderProduct } from './orders/order-product.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mypass',
      database: 'mydb',
      models: [Product, Order, OrderProduct],
      ssl: false,
      logging: true,
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController, ProductsController, OrdersController],
  providers: [AppService],
})
export class AppModule {}
