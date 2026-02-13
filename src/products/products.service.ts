import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  /* ================= Create ================= */
  async create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  /* ================= Read All ================= */
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  /* ================= Read One ================= */
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /* ================= Update ================= */
  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, dto);
    return product.save();
  }

  /* ================= Delete ================= */
  async remove(id: string): Promise<Product> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return deleted;
  }

  /* ================= Search ================= */
  async search(query: {
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    sortPrice?: 'asc' | 'desc';
  }): Promise<Product[]> {
    const filter: any = {};

    if (query.keyword) {
      filter.name = {
        $regex: query.keyword,
        $options: 'i',
      };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
      if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
    }

    // ⭐ แก้ type ตรงนี้
    const sortOption: { price: 1 | -1 } =
      query.sortPrice === 'desc'
        ? { price: -1 }
        : { price: 1 };

    return this.productModel.find(filter).sort(sortOption).exec();
  }
}
