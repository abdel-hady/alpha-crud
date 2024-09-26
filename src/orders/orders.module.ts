import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.model';
import { OrderProduct } from './order-product.model';
import { Product } from 'src/products/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, Product, OrderProduct])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
