import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Between, In, IsNull, Like, Not, Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { Tag } from './entities/tag.entity';
import { ProductFilterDto } from './dto/product-filter.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Tag)
        private tagsRepository: Repository<Tag>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>
    ) {}

    async addProduct(productDto: ProductDto) : Promise<Product> {
        const checkProduct = await this.productsRepository.findOne({
            where:{
                name:productDto.name
                }
            });
        if (checkProduct) {
            throw new HttpException("Product's name already exists", HttpStatus.CONFLICT);
        }
        
        const checkCategory = await this.categoriesRepository.findOne({where: {id: productDto.categoryId}});

        if (!checkCategory) {
            throw new HttpException("Category not found", HttpStatus.CONFLICT);
        }

        const tags = await this.tagsRepository.findBy({id: In([productDto.tagId])});
        
        if (tags.length !== productDto.tagId.length) {
            throw new HttpException("Tags not found!", HttpStatus.NOT_FOUND);
        }

        const newProduct = this.productsRepository.create({
            ...productDto,
            category: checkCategory,
            tags: tags 
        });
        
        await this.productsRepository.save(newProduct);
    
        return newProduct;
    }

    async updateProduct(id: number, productDto: ProductDto) : Promise<Product> {
        const checkProduct = await this.productsRepository.findOne({ where: {id}, relations: ['tags']});
       
        if (!checkProduct) {
            throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
        }

        const checkCategory = await this.categoriesRepository.findOne({where: {id}});

        if (!checkCategory) {
            throw new HttpException("Category not found!", HttpStatus.NOT_FOUND);
        }
        
        let newTags = [];
        if (productDto.tagId && productDto.tagId.length > 0) {
            newTags = await this.tagsRepository.findBy({id: In([productDto.tagId])});
        }

        checkProduct.name = productDto.name;
        checkProduct.description = productDto.description;
        checkProduct.user_gender = productDto.user_gender;
        checkProduct.category = checkCategory;
        checkProduct.tags = newTags;
        
        await this.productsRepository.save(checkProduct);

    return checkProduct;
    }

    async getAllProduct(query: ProductFilterDto) {
        const items_per_page = query.items_per_page || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;

        const whereCondition : any = {
                    is_delete: false,
                    ...(query.search && {
                        name: Like(`%${query.search}%`),
                    }),
                    ...(query.categoryId && {
                        category: {
                            id: query.categoryId
                        }
                    }),
                    ...(query.colorId && {
                        colors: {
                            id: query.categoryId
                        }
                    }),
                    ...(query.sizeId && {
                        sizes: {
                            id: query.sizeId
                        }
                    }),
                }

        if (query.from !== undefined && query.to !== undefined) {
            whereCondition.variant = {
                price: Between(query.from, query.to)
            }
        }
       
        const [res, total] = await this.productsRepository.findAndCount(
            {
                take: items_per_page,
                skip: skip,
                where: whereCondition,
                relations: ['tags', 'variant', 'variant.thumbnail', 'category', 'variant.colors', 'variant.sizes'],
                select: {
                    id: true, name: true, description: true, user_gender: true, is_delete: true,
                    tags: {
                        id: true, name: true
                    },
                    variant: {
                        id: true, SKU: true, images: true, price: true, stock_quantity: true, material: true, discount: true,
                        thumbnail: {
                            id: true, thumbnail: true
                        },
                        colors: {
                            id: true, name: true
                        },
                        sizes: {
                            id: true, name: true
                        }
                    },
                    category: {
                        id: true, name: true
                    }
                }
            });
        const last_page = Math.ceil(total/items_per_page);
        const prev_page = page - 1 < 1 ? null : page - 1;
        const next_page = page + 1 > last_page ? null : page + 1;
        return {
            total,
            data: res,
            prev_page,
            next_page,
            last_page
        }
    } 

    async getOneProduct(id: number) {
        return await this.productsRepository.findOne(
            {
                where: {id},
                relations: ['tags', 'variant', 'variant.thumbnail', 'variant.colors', 'variant.sizes'],
                select: {
                    id: true, name: true, description: true, user_gender: true, is_delete: true,
                    tags: {
                        id: true, name: true
                    },
                    variant: {
                        id: true, SKU: true, images: true, price: true, stock_quantity: true, material: true,
                        colors: {
                            id: true, name: true
                        },
                        sizes: {
                            id: true, name: true
                        },
                        thumbnail: {
                            id: true, thumbnail: true
                        }
                    }
                }
            }
        );
    } 

    async deleteOneProduct(id: number) {
        const checkProduct = await this.productsRepository.findOne({where: {id}});
        if(!checkProduct) {
            throw new HttpException("Product not found!", HttpStatus.NOT_FOUND);
        }
        return await this.productsRepository.createQueryBuilder()
            .update(Product)
            .set({ is_delete: true })
            .where("id = :id", {id})
            .execute();
    }
}
