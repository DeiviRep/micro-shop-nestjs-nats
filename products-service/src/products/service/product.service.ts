import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Product } from '../entity/product.entity';
import { Messages } from '../common/constants/response-messages';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
  ) {}

  async createProduct(dataDto: CreateProductDto) {
    const { name, price, userId} = dataDto;
    try {
      const user = await firstValueFrom(
        this.userClient.send('FIND_USER_BY_ID', { id: userId }),
      );
      if (!user) {
        throw new RpcException({ statusCode: 404, message: Messages.EXCEPTION_NOT_FOUND });
      }
      const product = this.productRepository.create({ name, price, userId });
      return this.productRepository.save(product);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({ statusCode: 500, message: Messages.EXCEPTION_INTERNAL_SERVER_ERROR});
    }
  }

  async getProductsByUser(userId: string) {
    try {
      const user = await firstValueFrom(
        this.userClient.send('FIND_USER_BY_ID', { id: userId }),
      );
      if (!user) {
        throw new RpcException({ statusCode: 404, message: Messages.EXCEPTION_NOT_FOUND });
      }
  
      return this.productRepository.find({ where: { userId } });
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({ statusCode: 500, message: Messages.EXCEPTION_INTERNAL_SERVER_ERROR});
    }
  }
}