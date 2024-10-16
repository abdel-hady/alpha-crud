import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { ProductsProcessor } from 'src/processors/products.processor';
import { MailerCustomModule } from './mailer.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'product-queue',
    }),
    MailerCustomModule,
  ],
  providers: [ProductsProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
