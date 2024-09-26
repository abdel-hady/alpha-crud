import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Order } from './order.model';
import { Product } from '../products/product.model';

@Table({
  tableName: 'order_products',
  timestamps: false,
})
export class OrderProduct extends Model<OrderProduct> {
  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;
}
