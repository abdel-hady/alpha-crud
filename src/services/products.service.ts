import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
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
    return {
      products,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: limit,
    };
  }

  async getProductById(id: number) {
    return await this.productModel.findByPk(id);
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
