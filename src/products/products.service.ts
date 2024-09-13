import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.module';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
  ) {}

  async createProduct(name: string, type: string, description: string) {
    const product = await this.productModel.create({
      name,
      type,
      description,
    });
    return product;
  }

  async getAllProducts() {
    return await this.productModel.findAll();
  }

  async getProductById(id: number) {
    return await this.productModel.findByPk(id);
  }

  async updateProduct(
    id: number,
    name: string,
    type: string,
    description: string,
  ) {
    await this.productModel.update(
      {
        name,
        type,
        description,
      },
      {
        where: {
          id,
        },
      },
    );
    return await this.productModel.findByPk(id);
  }

  async deleteProduct(id: number) {
    await this.productModel.destroy({
      where: {
        id,
      },
    });
    return { message: 'Product deleted successfully' };
  }
}
