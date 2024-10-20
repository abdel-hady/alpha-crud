import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import type { RedisClientOptions } from 'redis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { QueuesModule } from '../../services/queues/queues.module';
import { ProductsController } from '../controllers/products.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Product]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    QueuesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }
