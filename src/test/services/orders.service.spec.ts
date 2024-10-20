import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../../orders/services/orders.service';
import { getModelToken } from '@nestjs/sequelize';
import { Order } from '../../orders/models/order.model';
import { Product } from '../../products/models/product.model';
import { OrderProduct } from '../../orders/models/order-product.model';
import { CreateOrderDto } from '../../orders/dto/create-order.dto';

const mockOrderModel = {
  create: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

const mockProductModel = {
  findAll: jest.fn(),
};

const mockOrderProductModel = {
  bulkCreate: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getModelToken(Order), useValue: mockOrderModel },
        { provide: getModelToken(Product), useValue: mockProductModel },
        {
          provide: getModelToken(OrderProduct),
          useValue: mockOrderProductModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order with associated products', async () => {
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

    const createdOrder = {
      id: 1,
      shippingDetails: createOrderDto.shippingDetails,
      personalDetails: createOrderDto.personalDetails,
      isApproved: false,
    };

    mockOrderModel.create.mockResolvedValue(createdOrder);

    const orderProducts = [
      { orderId: 1, productId: 1 },
      { orderId: 1, productId: 2 },
    ];

    mockOrderProductModel.bulkCreate.mockResolvedValue(orderProducts);

    const result = await service.createOrder(createOrderDto);

    expect(result).toEqual(createdOrder);
    expect(mockOrderModel.create).toHaveBeenCalledWith({
      shippingDetails: createOrderDto.shippingDetails,
      personalDetails: createOrderDto.personalDetails,
      isApproved: createOrderDto.isApproved,
    });
    expect(mockOrderProductModel.bulkCreate).toHaveBeenCalledWith(
      orderProducts,
    );
  });

  it('should return all orders with associated products', async () => {
    const orders = [
      {
        id: 1,
        shippingDetails: {},
        personalDetails: {},
        products: [{ id: 1, name: 'Product 1' }],
      },
    ];
    mockOrderModel.findAll.mockResolvedValue(orders);

    const result = await service.getAllOrders();

    expect(result).toEqual(orders);
    expect(mockOrderModel.findAll).toHaveBeenCalledWith({ include: [Product] });
  });

  it('should return a specific order by ID', async () => {
    const order = {
      id: 1,
      shippingDetails: {},
      personalDetails: {},
      products: [{ id: 1, name: 'Product 1' }],
    };
    mockOrderModel.findByPk.mockResolvedValue(order);

    const result = await service.getOrderById(1);

    expect(result).toEqual(order);
    expect(mockOrderModel.findByPk).toHaveBeenCalledWith(1, {
      include: [Product],
    });
  });

  it('should delete an order', async () => {
    mockOrderModel.destroy.mockResolvedValue(1);

    const result = await service.deleteOrder(1);

    expect(result).toEqual({ message: 'Order deleted successfully' });
    expect(mockOrderModel.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should approve an order', async () => {
    const order = { id: 1, isApproved: false, update: jest.fn() };
    mockOrderModel.findByPk.mockResolvedValue(order);

    await service.approveOrder(1);

    expect(order.update).toHaveBeenCalledWith({ isApproved: true });
  });
});
