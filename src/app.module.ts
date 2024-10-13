import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './modules/products.module';
import { OrdersModule } from './modules/orders.module';
import { Product } from './models/product.model';
import { Order } from './models/order.model';
import { OrderProduct } from './models/order-product.model';
import { AuthModule } from './modules/auth.module';
import { User } from './models/user.model';
import { ProtectedModule } from './modules/protected.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mypass',
      database: 'mydb',
      models: [Product, Order, OrderProduct, User],
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    ProtectedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
