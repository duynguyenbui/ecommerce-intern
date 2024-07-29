import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { Tag } from './entities/tag.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Tag, Category]),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
