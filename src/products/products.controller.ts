import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createProduct(
    @Body() product: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoPath = file ? file.filename : null;
    return await this.productsService.createProduct(
      product.name,
      product.type,
      product.description,
      photoPath,
    );
  }

  @Get()
  async getAllProducts(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('sortField') sortField: string,
    @Query('sort') sort: 'ASC' | 'DESC',
    @Query('filter') filter?: string,
  ) {
    const limitValue = limit ? parseInt(limit, 10) : 10;
    const pageValue = page ? parseInt(page, 10) : 1;
    const offset = (pageValue - 1) * limitValue;

    const pagination = { limit: limitValue, offset };
    const sorting = { field: sortField || 'id', order: sort || 'ASC' };

    let filtering = [];
    if (filter) {
      filtering = filter.split(',').map((filterPair) => {
        const [field, value] = filterPair.split(':');
        return { field, value };
      });
    }

    return await this.productsService.getAllProducts(
      pagination,
      sorting,
      filtering,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return await this.productsService.getProductById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('id') id: number,
    @Body() product: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.productsService.updateProduct(
      id,
      product.name,
      product.type,
      product.description,
      file?.filename,
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productsService.deleteProduct(id);
  }
}
