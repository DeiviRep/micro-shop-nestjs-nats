import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Product } from '../entity/product.entity';
import { Messages } from '../common/constants/response-messages';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  async createProduct(name: string, price: number, userId: string): Promise<Product> {
    const user = await firstValueFrom(
      this.userClient.send('FIND_USER_BY_ID', { id: userId }),
    );
    if (!user) {
      throw new NotFoundException(Messages.EXCEPTION_NOT_FOUND)
    }

    const product = this.productRepository.create({ name, price, userId });
    return this.productRepository.save(product);
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    const user = await firstValueFrom(
      this.userClient.send('FIND_USER_BY_ID', { id: userId }),
    );
    if (!user) {
      throw new NotFoundException(Messages.EXCEPTION_NOT_FOUND)
    }

    return this.productRepository.find({ where: { userId } });
  }
}