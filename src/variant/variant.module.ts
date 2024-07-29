import { Module } from '@nestjs/common';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Variant } from 'src/product/entities/variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thumbnail } from 'src/product/entities/thumbnail.entity';
import { Product } from 'src/product/entities/product.entity';
import { Size } from 'src/size/entities/size.entity';
import { Color } from 'src/color/entities/color.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variant, Thumbnail, Product, Size, Color]),
  ],
  controllers: [VariantController],
  providers: [VariantService, CloudinaryService]
})
export class VariantModule {}
