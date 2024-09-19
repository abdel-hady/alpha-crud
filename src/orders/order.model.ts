import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Product } from 'src/products/product.module';
import { OrderProduct } from './order-product.model';

@Table({
  tableName: 'orders',
  timestamps: true, // Automatically adds createdAt and updatedAt
})
export class Order extends Model<Order> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.JSONB, // Using JSONB to store structured data
    allowNull: false,
  })
  shippingDetails: {
    street: string;
    cardNumber: string;
    extraInfo1: string;
    extraInfo2: string;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    extraInfo1: string;
    extraInfo2: string;
  };

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false, // Initially, orders are not approved
  })
  isApproved: boolean;

  @BelongsToMany(() => Product, () => OrderProduct) // Many-to-many with Product
  products: Product[];
}
