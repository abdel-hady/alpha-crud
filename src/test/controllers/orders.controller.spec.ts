import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../../ controllers/orders.controller';
import { OrdersService } from '../../services/orders.service';
import { CreateOrderDto } from '../../dtos/orders/create-order.dto';
import { UpdateOrderDto } from '../../dtos/orders/update-order.dto';

const mockOrdersService = {
  createOrder: jest.fn(),
  getAllOrders: jest.fn(),
  getOrderById: jest.fn(),
  updateOrder: jest.fn(),
  approveOrder: jest.fn(),
  deleteOrder: jest.fn(),
};

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      shippingDetails: {
        street: '123 Test St',
        cardNumber: '1234 5678 9012 3456',
        extraInfo1: 'N/A',
        extraInfo2: 'N/A',
      },
      personalDetails: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        extraInfo1: 'N/A',
        extraInfo2: 'N/A',
      },
      isApproved: false,
      productIds: [1, 2],
    };

    const createdOrder = { id: 1, ...createOrderDto };
    mockOrdersService.createOrder.mockResolvedValue(createdOrder);

    const result = await controller.createOrder(createOrderDto);

    expect(result).toEqual(createdOrder);
    expect(mockOrdersService.createOrder).toHaveBeenCalledWith(createOrderDto);
  });

  it('should return all orders', async () => {
    const orders = [{ id: 1 }];
    mockOrdersService.getAllOrders.mockResolvedValue(orders);

    const result = await controller.getAllOrders();

    expect(result).toEqual(orders);
    expect(mockOrdersService.getAllOrders).toHaveBeenCalled();
  });

  it('should return an order by ID', async () => {
    const order = {
      id: 1,
      shippingDetails: {},
      personalDetails: {},
      products: [],
    };
    mockOrdersService.getOrderById.mockResolvedValue(order);

    const result = await controller.getOrderById(1);

    expect(result).toEqual(order);
    expect(mockOrdersService.getOrderById).toHaveBeenCalledWith(1);
  });

  it('should delete an order', async () => {
    const message = { message: 'Order deleted successfully' };
    mockOrdersService.deleteOrder.mockResolvedValue(message);

    const result = await controller.deleteOrder(1);

    expect(result).toEqual(message);
    expect(mockOrdersService.deleteOrder).toHaveBeenCalledWith(1);
  });

  it('should approve an order', async () => {
    const order = { id: 1, isApproved: true };
    mockOrdersService.approveOrder.mockResolvedValue(order);

    const result = await controller.approveOrder(1);

    expect(result).toEqual(order);
    expect(mockOrdersService.approveOrder).toHaveBeenCalledWith(1);
  });
});
