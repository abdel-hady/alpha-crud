// import { Test, TestingModule } from '@nestjs/testing';
// import { ProductsService } from './products.service';
// import { getModelToken } from '@nestjs/sequelize';
// import { Product } from './product.model';

// describe('ProductsService', () => {
//   let service: ProductsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ProductsService,
//         {
//           provide: getModelToken(Product),
//           useValue: {
//             findAll: jest.fn(),
//             findOne: jest.fn(),
//             create: jest.fn(),
//             update: jest.fn(),
//             remove: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<ProductsService>(ProductsService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   // Example of snapshot testing
//   it('should match the snapshot of product creation', () => {
//     const product = {
//       id: 1,
//       name: 'Sample Product',
//       price: 100,
//     };
//     expect(product).toMatchSnapshot();
//   });
// });
