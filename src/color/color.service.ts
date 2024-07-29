import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './entities/color.entity';
import { Repository } from 'typeorm';
import { ColorDto } from './dto/color.dto';
import { ProductColorFilterDto } from './dto/color-filter.dto';

@Injectable()
export class ColorService {
    constructor (
        @InjectRepository(Color)
        private colorsRepository : Repository<Color>
    ) {}

    async addColor (colorDto : ColorDto) {
        const checkColor = await this.colorsRepository.findOne({    
            where: {
                name: colorDto.name
            }
        });
        if (checkColor) {
            throw new HttpException("Color already exists", HttpStatus.CONFLICT);
        }
        return await this.colorsRepository.save(colorDto);
    }

    async getAllColor () {
        return await this.colorsRepository.find({
            select: ['id', 'name']
        });
    }

    async getOneColor (id: number, query: ProductColorFilterDto) {
        const checkColor = await this.colorsRepository.findOne({    
            where: {
                id,
                variants: {
                    id: query.variantId
                }
            },
            relations: [
                'variants.colors',
                'variants',
                'variants.thumbnail',
                'variants.sizes'
            ]
        }); 
        if (!checkColor) {
            throw new HttpException("Color not found", HttpStatus.CONFLICT);
        }
        return {
            id: checkColor.id,
            name: checkColor.name,
            variant: checkColor.variants.map(element => {
                return {
                    id: element.id,
                    SKU: element.SKU,
                    price: element.price,
                    images: element.images,
                    stock_quantity: element.stock_quantity,
                    material: element.material,
                    discount: element.discount,
                    thumbnail: element.thumbnail.map(e => {
                        return {
                            id: e.id,
                            thumb: e.thumbnail
                        }
                    }),
                    size: element.sizes.map(s => {
                        return {
                            id: s.id,
                            name: s.name
                        }
                    })
                }
            })
        };
    }
}
