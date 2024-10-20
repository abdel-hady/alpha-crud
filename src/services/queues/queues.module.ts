import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { MailerCustomModule } from '../mailer/mailer.module';
import { ProductsProcessor } from 'src/products/processors/products.processor';

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
export class QueuesModule { }
