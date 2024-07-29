import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { VariantDto } from './dto/variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from 'src/product/entities/variant.entity';
import { Repository } from 'typeorm';
import { Thumbnail } from 'src/product/entities/thumbnail.entity';
import { Product } from 'src/product/entities/product.entity';
import { Size } from 'src/size/entities/size.entity';
import { Color } from 'src/color/entities/color.entity';


@Injectable()
export class VariantService {
    constructor(
        private cloudinaryService: CloudinaryService,
        @InjectRepository(Variant)
        private variantRepository: Repository<Variant>,
        @InjectRepository(Thumbnail)
        private thumbnailRepository: Repository<Thumbnail>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Size)
        private sizeRepository: Repository<Size>,
        @InjectRepository(Color)
        private colorRepository: Repository<Color>
    ){}

    
    async addProductVariant(variantDto: VariantDto, files: Express.Multer.File[]) {
        const checkProduct = await this.productRepository.findOne({
            where: { id: variantDto.productId }
        });

        if (!checkProduct) {
            throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
        }

        const checkSize = await this.sizeRepository.findOne({
            where: { id: variantDto.sizeId }
        });

        if (!checkSize) {
            throw new HttpException("Size not found!", HttpStatus.NOT_FOUND);
        }
    
        const checkColor = await this.colorRepository.findOne({
            where: { id: variantDto.colorId }
        });

        if (!checkColor) {
            throw new HttpException("Color not found!", HttpStatus.NOT_FOUND);
        }

        const imagesUpload = files.map((file, index) => {
            if (index === 0) {
                return this.cloudinaryService.uploadFile(file, 800, 800);
            } else {
                return this.cloudinaryService.uploadFile(file, 300, 300);
            }
        });
        const uploadResults = await Promise.all(imagesUpload);
        
        const imageUrls = uploadResults.map(result => result.url);
        

        const newVariantProduct = await this.variantRepository.save({
            images: imageUrls[0],
            material: variantDto.material,
            price: variantDto.price,
            stock_quantity: variantDto.stock_quantity,
            SKU: variantDto.SKU,
            product: checkProduct,
            colors: [checkColor],
            sizes: [checkSize]
        });
        
        const thumbnails = imageUrls.slice(1).map(url => {
            const thumbnail = this.thumbnailRepository.create({
                thumbnail: url,
                variant: newVariantProduct
            });
            return thumbnail;
        });

        await this.thumbnailRepository.save(thumbnails);

        return newVariantProduct;
    }

    async updateProductVariant(id: number, data: VariantDto) {
        const checkProductVariant = await this.variantRepository.findOne({where: {id}});
        if(!checkProductVariant) {
            throw new HttpException("Variant not found!", HttpStatus.NOT_FOUND);
        }

        const checkProduct = await this.productRepository.findOne({
            where: { id: data.productId }
        });
        if (!checkProduct) {
            throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
        }

        const checkColor = await this.colorRepository.findOne({where: {
            id: data.colorId
        }});

        if(!checkColor) {
            throw new HttpException("Color not found!", HttpStatus.NOT_FOUND);
        }

        const checkSize = await this.sizeRepository.findOne({where: {
            id: data.sizeId
        }});
        
        if(!checkSize) {
            throw new HttpException("Size not found!", HttpStatus.NOT_FOUND);
        }

        return await this.variantRepository.createQueryBuilder()
        .update(Variant)
        .set({
            SKU: data.SKU,
            images: checkProductVariant.images,
            stock_quantity: data.stock_quantity,
            material: data.material,
            price: data.price,
            product: checkProduct,
            colors: [checkColor],
            sizes: [checkSize]
        })
        .where("id = :id", {id})
        .execute();
    }
    
}
