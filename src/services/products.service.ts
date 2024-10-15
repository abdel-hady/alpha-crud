import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from '../models/product.model';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('product-queue') private readonly productQueue: Queue,
  ) { }

  async createProduct(
    name: string,
    type: string,
    description: string,
    photoPath: string,
  ) {
    const product = await this.productModel.create({
      name,
      type,
      description,
      photo: photoPath,
    });
    this.logger.log(`Product created: ${JSON.stringify(product)}`);
    return product;
  }

  async getAllProducts(
    pagination: { limit: number; offset: number },
    sorting: { field: string; order: 'ASC' | 'DESC' },
    filtering: { field: string; value: string }[],
  ) {
    const cacheKey = `products:limit=${pagination.limit}:offset=${pagination.offset}:sorting=${sorting.field}:${sorting.order}:filtering=${JSON.stringify(filtering)}`;
    console.log(await this.cacheManager.store.keys());
    const cachedProducts = await this.cacheManager.get(cacheKey);

    if (cachedProducts) {
      this.logger.log(`Retrieved products from cache`);
      this.logger.log(cachedProducts);
      return cachedProducts;
    }

    const { limit, offset } = pagination;
    const { field, order } = sorting;
    const filters = filtering.map((filter) => ({
      [filter.field]: { [Op.like]: `%${filter.value}%` },
    }));

    const { count: totalItems, rows: products } =
      await this.productModel.findAndCountAll({
        where: filters.reduce((acc, filter) => ({ ...acc, ...filter }), {}),
        order: [[field, order]],
        limit,
        offset,
      });

    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    this.logger.log(`Retrieved ${totalItems} products`);
    const result = {
      products,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: limit,
    };

    const res = await this.cacheManager.set(cacheKey, result, 0);
    console.log(res);
    this.logger.log(`Cached products data`);

    return result;
  }

  async getProductById(id: number) {
    return await this.productModel.findByPk(id);
  }

  async updateProductStockInQueue(productId: number) {
    await this.productQueue.add('update-product-stock', {
      productId,
    });
    this.logger.log(
      `Stock update job added to the queue for product ID: ${productId}`,
    );
  }
  async updateProduct(
    id: number,
    name: string,
    type: string,
    description: string,
    photo?: string,
  ) {
    const updateData = { name, type, description };
    if (photo) updateData['photo'] = photo;
    await this.updateProductStockInQueue(id);
    await this.productModel.update(updateData, {
      where: { id },
    });
    return await this.productModel.findByPk(id);
  }

  async deleteProduct(id: number) {
    await this.productModel.destroy({
      where: { id },
    });
    this.logger.log(`Product deleted: ID = ${id}`);
    return { message: 'Product deleted successfully' };
  }
}
