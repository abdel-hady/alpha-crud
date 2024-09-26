import { Test, TestingModule } from '@nestjs/testing';
import { ProtectedController } from './protected.controller';
import { ProtectedService } from './protected.service';

describe('ProtectedController', () => {
  let controller: ProtectedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProtectedController],
      providers: [ProtectedService],
    }).compile();

    controller = module.get<ProtectedController>(ProtectedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
