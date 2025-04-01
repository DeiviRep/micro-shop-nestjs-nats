import { Controller, Post, Get, Body, Param, UseGuards, Req, BadRequestException, Request, ForbiddenException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('products')
export class ProductsController extends AbstractController{
  constructor(private productsService: ProductsService) {
    super();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createProduct(@Body() body: { name: string; price: number}, @Req() req: any) {
    const userId = this.getUser(req)
    return this.productsService.createProduct(body.name, body.price, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  async getProductsByUser(@Param('id') userId: string, @Req() req: any) {
    this.getUser(req)
    return this.productsService.getProductsByUser(userId);
  }
}