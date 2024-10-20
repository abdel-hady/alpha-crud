import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/modules/products.module';
import { OrdersModule } from './orders/modules/orders.module';
import { Product } from './products/models/product.model';
import { Order } from './orders/models/order.model';
import { OrderProduct } from './orders/models/order-product.model';
import { AuthModule } from './auth/modules/auth.module';
import { User } from './auth/models/user.model';
import { RedisModule } from './modules/redis.module';
import { QueuesModule } from './services/queues/queues.module';
import { MailerCustomModule } from './services/mailer/mailer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulerService } from './services/scheduler/task-scheduler.service';
import { CustomMailerService } from './services/mailer/custom-mailer.service';

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
    RedisModule,
    QueuesModule,
    MailerCustomModule,
  ],
  controllers: [],
  providers: [TaskSchedulerService, CustomMailerService],
})
export class AppModule {}
