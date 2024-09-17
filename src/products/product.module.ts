import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'products', // Explicitly set the table name
  timestamps: true, // Add createdAt and updatedAt columns
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;
}
