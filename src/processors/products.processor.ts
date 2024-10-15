import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@Processor('product-queue')
export class ProductsProcessor {
  private readonly logger = new Logger(ProductsProcessor.name);

  @Process('update-product-stock')
  async handleStockUpdate(job: Job) {
    const { productId, newStock } = job.data;
    this.logger.log(
      `Processing stock update for product ID: ${productId} with new stock: ${newStock}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.logger.log(`Stock updated for product ID: ${productId}`);
  }
}
