import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/product/entities/tag.entity';
import { Repository } from 'typeorm';
import { TagDto } from './dto/tag.dto';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>
    ){}

    async addTag(tagDto: TagDto): Promise<Tag> {
        const checkTag = await this.tagRepository.findOne({ where: { name: tagDto.name } });
        if (checkTag) {
            throw new HttpException("Tag already exists", HttpStatus.CONFLICT);
        }
        return await this.tagRepository.save(tagDto);
    }

    async getAllTag(): Promise<Tag[]> {
        return await this.tagRepository.find({
            select: ['id', 'name']
        });
    }
}
