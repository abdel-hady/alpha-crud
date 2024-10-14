import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { ProductsController } from 'src/ controllers/products.controller';
import type { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      // Store-specific configuration:
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
