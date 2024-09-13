import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() product: any) {
    return await this.productsService.createProduct(
      product.name,
      product.type,
      product.description,
    );
  }

  @Get()
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return await this.productsService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() product: any) {
    return await this.productsService.updateProduct(
      id,
      product.name,
      product.type,
      product.description,
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productsService.deleteProduct(id);
  }
}
