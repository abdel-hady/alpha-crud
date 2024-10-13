import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { CreateOrderDto } from '../dtos/orders/create-order.dto';
import { UpdateOrderDto } from '../dtos/orders/update-order.dto';
import { OrderProduct } from '../models/order-product.model';
import { Product } from '../models/product.model';

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
      const order = await this.orderModel.create({
        shippingDetails: createOrderDto.shippingDetails,
        personalDetails: createOrderDto.personalDetails,
        isApproved: createOrderDto.isApproved || false,
      });

      console.log('Order created:', order.id);

      const productIds = createOrderDto.productIds;
      if (productIds && productIds.length > 0) {
        const orderProducts = productIds.map((productId) => ({
          orderId: order.id,
          productId,
        }));

        await OrderProduct.bulkCreate(orderProducts);
        console.log('OrderProducts created:', orderProducts);
      } else {
        console.warn('No productIds provided for the order.');
      }

      return order;
    } catch (error) {
      console.error('Error while creating order:', error);
      throw error;
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
