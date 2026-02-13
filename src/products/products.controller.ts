import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body: { name: string; price: number }) {
    return this.productsService.create(body);
  }
}
