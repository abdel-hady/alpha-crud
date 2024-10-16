import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './modules/products.module';
import { OrdersModule } from './modules/orders.module';
import { Product } from './models/product.model';
import { Order } from './models/order.model';
import { OrderProduct } from './models/order-product.model';
import { AuthModule } from './modules/auth.module';
import { User } from './models/user.model';
import { ProtectedModule } from './modules/protected.module';
import { LoggerModule } from './modules/logger.module';
import { RedisModule } from './modules/redis.module';
import { QueuesModule } from './modules/queues.module';
import { MailerCustomModule } from './modules/mailer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './services/task-scheduler.service';
import { CustomMailerService } from './services/custom-mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        models: [Product, Order, OrderProduct, User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
    ProtectedModule,
    LoggerModule,
    RedisModule,
    QueuesModule,
    MailerCustomModule,
  ],
  controllers: [],
  providers: [TaskSchedulerService, CustomMailerService],
})
export class AppModule {}
