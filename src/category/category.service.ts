import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>
    ) {}

    async addCategory (categoryDto: CategoryDto) {
        const checkCategory = await this.categoriesRepository.findOne({
            where: { name: categoryDto.name }
        });

        if (checkCategory) {
            throw new HttpException("Category already exists", HttpStatus.CONFLICT);
        }

        return await this.categoriesRepository.save(categoryDto);

    }

    async updateCategory (id: number, categoryDto: CategoryDto) {
        const checkCategory = await this.categoriesRepository.findOne({ 
            where: { id }
        });

        if (!checkCategory) {
            throw new HttpException("Category not found", HttpStatus.NOT_FOUND);
        }

        return await this.categoriesRepository.createQueryBuilder()
        .update(Category)
        .set({ name: categoryDto.name })
        .where("id = :id", {id})
        .execute();
    }

    async getAllCategory () {
        return this.categoriesRepository.find({
            select: ['id', 'name']
        });
    }
    
}
