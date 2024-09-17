import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mypass',
      database: 'mydb',
      models: [Product],
      ssl: false,
      logging: true,
      synchronize: true,
    }),
    ProductsModule,
    OrdersModule,
    UsersModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
