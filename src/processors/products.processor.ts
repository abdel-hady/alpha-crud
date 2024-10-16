import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { CustomMailerService } from 'src/services/custom-mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
@Processor('product-queue')
export class ProductsProcessor {
  constructor(
    private readonly mailerService: CustomMailerService,
    private configService: ConfigService,
  ) {}

  @Process('update-product-stock')
  async handleUpdateProductStock(job: Job) {
    const { productId } = job.data;

    const email = this.configService.get('MAIL_TO');
    const subject = `Stock Updated for Product ID ${productId}`;
    const context = productId;

    await this.mailerService.sendEmail(email, subject, context);
  }
}
