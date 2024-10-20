import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../models/order.model';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderProduct } from '../models/order-product.model';
import { Product } from '../../products/models/product.model';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
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

      this.logger.log(`Order created with ID: ${order.id}`);

      const productIds = createOrderDto.productIds;
      if (productIds && productIds.length > 0) {
        const orderProducts = productIds.map((productId) => ({
          orderId: order.id,
          productId,
        }));
        await OrderProduct.bulkCreate(orderProducts);
        this.logger.log(`Order products created for order ID: ${order.id}`);
      } else {
        this.logger.warn(`No products provided for order ID: ${order.id}`);
      }

      return order;
    } catch (error) {
      this.logger.error(`Error while creating order: ${error.message}`);
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
      this.logger.error(`Order not found with ID: ${id}`);
      throw new Error('Order not found');
    }
    await order.update({ isApproved: true });
    this.logger.log(`Order with ID ${id} approved`);
    return order;
  }

  async deleteOrder(id: number) {
    await this.orderModel.destroy({ where: { id } });
    return { message: 'Order deleted successfully' };
  }
}
