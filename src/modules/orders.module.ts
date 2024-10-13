import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from '../services/orders.service';
import { OrdersController } from '../ controllers/orders.controller';
import { Order } from '../models/order.model';
import { OrderProduct } from '../models/order-product.model';
import { Product } from 'src/models/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, Product, OrderProduct])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
