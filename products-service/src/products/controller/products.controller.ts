import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from '../service/product.service';
import { CreateProductDto } from '../dto/create-product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('CREATE_PRODUCT')
  async createProduct(@Payload() dataDto: CreateProductDto) {
    return this.productsService.createProduct(dataDto);
  }

  @MessagePattern('GET_PRODUCTS_BY_USER')
  async getProductsByUser(@Payload() data: { userId: string }) {
    return this.productsService.getProductsByUser(data.userId);
  }
}