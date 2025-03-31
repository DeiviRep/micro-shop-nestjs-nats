import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from '../service/product.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('CREATE_PRODUCT')
  async createProduct(data: { name: string; price: number; userId: string }) {
    return this.productsService.createProduct(data.name, data.price, data.userId);
  }

  @MessagePattern('GET_PRODUCTS_BY_USER')
  async getProductsByUser(data: { userId: string }) {
    return this.productsService.getProductsByUser(data.userId);
  }
}