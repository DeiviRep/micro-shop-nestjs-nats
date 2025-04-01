import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
  ) {}

  async createProduct(name: string, price: number, userId: string) {
    return firstValueFrom(
      this.productClient.send('CREATE_PRODUCT', { name, price, userId }),
    );
  }

  async getProductsByUser(userId: string) {
    return firstValueFrom(
      this.productClient.send('GET_PRODUCTS_BY_USER', { userId }),
    );
  }
}