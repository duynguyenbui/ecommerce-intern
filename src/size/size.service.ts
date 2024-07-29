import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';
import { SizeDto } from './dto/size.dto';

@Injectable()
export class SizeService {
    constructor (
        @InjectRepository(Size)
        private sizesRepository : Repository<Size>
    ) {}

    async addSize (sizeDto : SizeDto) {
        const checkSize = await this.sizesRepository.findOne({    
            where: {
                name: sizeDto.name
            }
        });
        if (checkSize) {
            throw new HttpException("Color already exists", HttpStatus.CONFLICT);
        }
        return await this.sizesRepository.save(sizeDto);
    }

    async getAllSize () {
        return await this.sizesRepository.find({
            select: ['id', 'name']
        });
    }
}
