import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductsService } from '../../products/services/products.service';
import { Product } from '../../products/models/product.model';

// Mock data for the product
const mockProduct = {
  id: 1,
  name: 'Test Product',
  type: 'Test Type',
  description: 'Test Description',
  photo: 'test-photo.jpg',
};

const mockProductArray = [mockProduct];

const mockProductModel = {
  create: jest.fn().mockResolvedValue(mockProduct),
  findAndCountAll: jest.fn().mockResolvedValue({
    count: mockProductArray.length,
    rows: mockProductArray,
  }),
  findByPk: jest.fn().mockResolvedValue(mockProduct),
  update: jest.fn().mockResolvedValue([1]),
  destroy: jest.fn().mockResolvedValue(1),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const result = await service.createProduct(
        'Test Product',
        'Test Type',
        'Test Description',
        'test-photo.jpg',
      );
      expect(result).toEqual(mockProduct);
      expect(mockProductModel.create).toHaveBeenCalledWith({
        name: 'Test Product',
        type: 'Test Type',
        description: 'Test Description',
        photo: 'test-photo.jpg',
      });
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products with pagination', async () => {
      const pagination = { limit: 10, offset: 0 };
      const sorting = { field: 'id', order: 'ASC' as 'ASC' | 'DESC' };
      const filtering = [];
      const result = await service.getAllProducts(
        pagination,
        sorting,
        filtering,
      );
      expect(result.products).toEqual(mockProductArray);
      expect(result.totalItems).toEqual(mockProductArray.length);
      expect(result.totalPages).toEqual(1);
      expect(result.currentPage).toEqual(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const result = await service.getProductById(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const result = await service.updateProduct(
        1,
        'Updated Product',
        'Updated Type',
        'Updated Description',
        'updated-photo.jpg',
      );
      expect(mockProductModel.update).toHaveBeenCalledWith(
        {
          name: 'Updated Product',
          type: 'Updated Type',
          description: 'Updated Description',
          photo: 'updated-photo.jpg',
        },
        { where: { id: 1 } },
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      const result = await service.deleteProduct(1);
      expect(mockProductModel.destroy).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual({ message: 'Product deleted successfully' });
    });
  });
});
