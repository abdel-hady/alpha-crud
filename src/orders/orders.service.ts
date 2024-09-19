import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from 'src/products/product.module';
import { OrderProduct } from './order-product.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      // First, create the order entry
      const order = await this.orderModel.create({
        shippingDetails: createOrderDto.shippingDetails,
        personalDetails: createOrderDto.personalDetails,
        isApproved: createOrderDto.isApproved || false, // Default false if not provided
      });

      console.log('Order created:', order.id);

      // Check if the productIds array exists and has products
      const productIds = createOrderDto.productIds;
      if (productIds && productIds.length > 0) {
        // Map the productIds to create OrderProduct records
        const orderProducts = productIds.map((productId) => ({
          orderId: order.id, // Assign the newly created order's ID
          productId, // Assign the corresponding productId
        }));

        // Bulk create the OrderProduct records
        await OrderProduct.bulkCreate(orderProducts);
        console.log('OrderProducts created:', orderProducts);
      } else {
        console.warn('No productIds provided for the order.');
      }

      return order; // Return the created order
    } catch (error) {
      console.error('Error while creating order:', error);
      throw error; // Re-throw the error to be caught by NestJS
    }
  }

  async getAllOrders() {
    return this.orderModel.findAll({ include: [Product] });
  }

  async getOrderById(id: number) {
    return this.orderModel.findByPk(id, { include: [Product] });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findByPk(id);
    if (!order.isApproved) {
      const { productIds, ...orderDetails } = updateOrderDto;

      const products = await this.productModel.findAll({
        where: {
          id: productIds,
        },
      });

      await order.update(orderDetails);
      await order.$set('products', products);
    }
    return order;
  }

  async approveOrder(id: number) {
    const order = await this.orderModel.findByPk(id);
    if (!order) {
      throw new Error('Order not found');
    }
    await order.update({ isApproved: true });
    return order;
  }

  async deleteOrder(id: number) {
    await this.orderModel.destroy({ where: { id } });
    return { message: 'Order deleted successfully' };
  }
}
